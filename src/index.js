
import TwoWayTreeD3 from './component/twoWayTreeD3'

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
  treesData: data,
  onNodeClick: (d) => {
    alert(d.data.name)
  }
})

export default tree
