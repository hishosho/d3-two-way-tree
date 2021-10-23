# D3 Two Way Tree

 two side tree realized by [D3.js (v4)](https://github.com/d3/d3).

## Live Demo
 [Demo](https://hishosho.github.io/d3-two-way-tree/dist/index.html)

## Features
* Click callbacks.
* Customize the value of height, width and svg background color.
* Customize the color of nodes and lines.
* The node will change color when mouseover.
* Zoom.

## Running

First of all, make sure you have webpack installed. Then, clone the repository, install all dependencies, build and serve the project.

```bash
> git clone https://github.com/hishosho/d3-two-way-tree.git
> npm install
> npm run dev
```

Open `http://localhost:8080` in your favorite browser.

## Documentation

```javascript
const tree = new TwoWayTreeD3('#app', options);
```

### Options

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| **treesData** | *object* | Trees' data in [Trees' data format](#Trees-data-format). |
| **contentWidth** | *int* | svg's width. Default: 1920. |
| **contentHeight** | *int* | svg's height. Default: 700. |
| **marginTop** | *int* | margin top. Default: 20. |
| **marginRight** | *int* | margin right. Default: 120. |
| **marginBottom** | *int* | margin bottom. Default: 20. |
| **marginLeft** | *int* | margin left. Default: 120. |
| **viewBox** | *array* | viewBox. Default: [-contentWidth / 2, -contentHeight / 2, contentWidth, contentHeight]. |
| **treeBasedx** | *int* | x coordinate of node. Default: 30. |
| **treeBasedy** | *int* | y coordinate of node. Default: 700. |
| **treeCoordinate** | *int[]* | coordinate of tree. Default: [-200, 200]. |
| **nodeColor** | *string* | node's color. Default: #f9a11b. |
| **lineColor** | *string* | link's color. Default: #fff. |
| **focusNodeColor** | *string* | focus color of node. Default: #ff5f2e. |
| **svgBackground** | *string* | svg's background color. Default: #38598c. |
| **onNodeClick** | *function* | Callback function to be executed when the user clicks a node. |

### Documentation

#### Trees data format

```
{
  name: 'root',
  leftChildren: [
    {name: 'node_1'}
  ],
  rightChildren: [
    {name: 'node_2'}
  ]
}
```

### Example

Live example @ [https://hishosho.github.io/d3-two-way-tree/](https://hishosho.github.io/d3-two-way-tree/)

```javascript
const data = {
  name: 'root',
  leftChildren: [],
  rightChildren: []
}

for(let i = 0; i < 30; i++) {
  if (i % 2 === 0) {
    data.leftChildren.push({name: `node_${i}`})
  } else {
    data.rightChildren.push({name: `node_${i}`})
  }
}

const tree = new TwoWayTreeD3('#app', {
  contentWidth: window.innerWidth,
  contentHeight: window.innerHeight,
  treesData: data,
  onNodeClick: (d) => {
    alert(d.data.name)
  }
})
```

## What's coming?
* Performance optimization.
* Testing.
