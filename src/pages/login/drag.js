import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import 'babel-polyfill';
import { Draggable, Droppable } from 'react-drag-and-drop'

// 其他的拖拽插件：https://github.com/atlassian/react-beautiful-dnd
//　更稳定版本：https://react-dnd.github.io/react-dnd/
class App extends React.Component {
    render() {
      return (
        <div>
            <ul>
                <Draggable type="fruit" data="banana"><li>Banana</li></Draggable>
                <Draggable type="fruit" data="apple"><li>Apple</li></Draggable>
                <Draggable type="metal" data="silver"><li>Silver</li></Draggable>
            </ul>
            <Droppable
                types={['fruit']} // <= allowed drop types
                onDrop={this.onDrop.bind(this)}>
                <ul className="Smoothie" style={{width: "200px", height: "200px", backgroundColor: "#def"}}></ul>
            </Droppable>
        </div>
      )
    }
    onDrop(data) {
        console.log(data)
        // => banana 
    }
}

ReactDOM.render(<App/>, document.getElementById("root"));