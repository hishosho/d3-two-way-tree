
import * as d3 from 'd3'

class TwoWayTreeD3 {
  constructor (selector, options={}) {
    
    const {
      treesData,
      onNodeClick,
      marginTop = 20,
      marginRight = 120,
      marginBottom = 20,
      marginLeft = 120,
      viewBox=[],
      contentWidth = 1920,
      contentHeight = 700,
      treeBasedx = 30,
      treeBasedy = 700,
      treeCoordinate = [-200, 200],
      lineColor='#fff',
      svgBackground='#38598c',
      nodeColor='#f9a11b',
      focusNodeColor = '#ff5f2e'
    } = options
    
    this.options = {
      treesData,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
      viewBox,
      contentWidth,
      contentHeight,
      treeBasedx,
      treeBasedy,
      treeCoordinate,
      lineColor,
      svgBackground,
      nodeColor,
      focusNodeColor,
      onNodeClick
    } 

    this.validateParam(selector)

    this.selector = selector
    this.init()
    
  }
  validateParam (param) {
    if (!param) {
      throw new Error('selector is required')
    }
  }
  init () {
    this.svg = d3.select(this.selector)
        .append('svg')
          .style('background', this.options.svgBackground)
          .attr('width', this.options.contentWidth)
          .attr('height', this.options.contentHeight)
          .attr('viewBox', this.options.viewBox.length === 0
                            ? [-this.options.contentWidth / 2, -this.options.contentHeight / 2, this.options.contentWidth, this.options.contentHeight]
                            : this.options.viewBox)
          .call(this.zoomed())

    this.buildTrees()
    this.renderTrees()
  }
  zoomed () {
    return d3.zoom()
      .extent([[0, 0], [this.options.contentWidth, this.options.contentHeight]])
      .scaleExtent([0.5, 8])
      .on('zoom', () => {
        const transform = d3.event.transform
        d3.selectAll('.node-tree')
          .attr('transform', `translate(${transform.x},${transform.y}) scale(${transform.k})`)
      })
  }
  /**
   * 构建左右树数据
   */
  buildTrees () {
    const treeData = this.options.treesData,
          treeName = treeData.name,
          leftTree = treeData.leftChildren,
          rightTree = treeData.rightChildren

    this.leftTree = this.buildTree(treeName, leftTree)
    this.rightTree = this.buildTree(treeName, rightTree)
    this.buildBaseTree(leftTree, rightTree)
    
  }
  buildTree (name, children=[]) {
    if (children.length === 0) return
    return this.tree({ name, children })
  }
  /**
   * 设置基准树，从而确定跟节点的布局位置
   * 场景:
   * 1. 无左右树，只有根节点
   * 2. 只有左树或右树
   * 3. 同时有左右树，节点多的树为基准树
   */
  buildBaseTree (leftTree, rightTree) {
    if (!this.rightTree && !this.leftTree) {
      this.baseTree = this.tree({ name: treeName, children: [] })
    } else if (this.rightTree && !this.leftTree) {
      this.baseTree = this.rightTree
    } else if (!this.rightTree && this.leftTree) {
      this.baseTree = this.leftTree
    } else {
      this.baseTree = leftTree.length > rightTree.length ? this.leftTree : this.rightTree
    }
    this.x0 = Infinity
    this.baseTree.each(d => {
      if (d.x < this.x0) this.x0 = d.x
    })
  }
  /**
   * 渲染树
   */
  renderTrees () {
    if (!this.leftTree && !this.rightTree) {
      this.makeTree(this.baseTree, '')
    } else {
      this.leftTree && this.makeTree(this.leftTree, 'left')
      this.rightTree && this.makeTree(this.rightTree, 'right')
    }
  }
  makeTree (tree, direction) {
    const isLeft = direction === 'left'
    const svg = d3.select('svg')
          .append('g')
            .attr('transform', `translate(${this.options.treeCoordinate[0]},${this.options.treeCoordinate[1]})`)
            .attr('class', 'node-tree')
          
    const g = svg.append('g')
          .attr('font-size', 20)
          .attr('transform', `translate(${tree.dy / 3},${this.x0})`)

    g.append('g')
       .attr('fill-opacity', 0)
       .attr('stroke', this.options.lineColor)
       .attr('stroke-width', 2)
     .selectAll('path')
        .data(tree.links()).enter()
        .append('path')
          .attr('d', d3.linkHorizontal()
                       .x(d => isLeft ? (-d.y-50) : d.y)
                       .y(d => d.x))

    const node = g.append('g')
          .attr('stroke-linejoin', 'round')
          .attr('stroke-width', 3)
            .selectAll('g')
            .data(tree.descendants()).enter()
            .append('g')
              .attr('id', d => d.data.name)
              .attr('transform', d => isLeft ? `translate(${-d.y - 115},${-d.x})` : `translate(${d.y},${d.x})`)

    node.append('text')
        .attr('cursor', 'pointer')
        .attr('dy', '0.31em')
        .attr('fill', this.options.nodeColor)
        .attr("x", d => isLeft ? 60 : (d.children ? -6 : 6))
        .attr('text-anchor', d => {
          if (isLeft) {
            return d.children ? 'start' : 'end'
          } else {
            return d.children ? 'end' : 'start'
          }
        })
        .text(d => {
          if (isLeft) {
            return d.children && this.rightTree ? '' : d.data.name
          } else {
            return d.data.name
          }
        })
        .clone(true).lower()
    
    node.on('mouseover', (d) => {
      d3.select(`#${d.data.name}`)
        .selectAll('text')
        .attr('fill', this.options.focusNodeColor)
    })

    node.on('mouseleave', (d) => {
      d3.select(`#${d.data.name}`)
        .selectAll('text')
        .attr('fill', this.options.nodeColor)
    })

    node.on('click', (d) => {
      if (typeof this.options.onNodeClick === 'function') {
        this.options.onNodeClick(d)
      }
    })
  }
  tree (data) {
    const {
      contentWidth,
      contentHeight,
      marginRight,
      marginLeft,
      marginTop,
      marginBottom,
      treeBasedx,
      treeBasedy
    } = this.options

    const width = contentWidth - marginRight - marginLeft,
          height = contentHeight - marginTop - marginBottom,
          tree = d3.hierarchy(data)
    
    tree.dx = treeBasedx
    tree.dy = treeBasedy / (tree.height + 1)

    return d3.tree()
          .size([ height, width ])
          .nodeSize([tree.dx, tree.dy ])(tree)
  }
}

export default TwoWayTreeD3