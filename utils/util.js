export function getRule(data, assessId) {
  let item1 = [];
  let item2 = null;
  let item3 = [];
  data.forEach((item, index) => {
      if(item.assessid == assessId) {
        item.countScore = 0  
        item1.push(item);//标准名称
      }
      if(assessId == item.parent) {
          item2 = item;
          item2.singleScore = 0
          d(data,item.assessid, item2)
          item3.push(item2)
      }
  })
  item1.push(item3);
  return item1
}

function d(data, assessid, item2) {
  let item4 = [];
  data.forEach((item, index) => {
      if(item.parent == assessid){
          // item4[item.name] = item
          item.earnScore = 0
          item.checkStatus = 0
          item4.push(item)
      }
  })
  item2.item2 = item4
  return item2
}