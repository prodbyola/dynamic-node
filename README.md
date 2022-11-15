# Dynamic Node
A javascript package that lets you convert absolutely positioned html elements into resizable and draggable elements. [Demo and Documentation](https://dynode.netlify.app/)

## Installation
To install use npm: \
```npm i dynamic-node --save``` 

or yarn: \
```yarn add dynamic-node```

## Usage
### Step 1
In your html:
```html
    <div id="dynode-parent">
        <div id="dynode"></div>
    </div>
```

### Step 2
In your css, ensure target's parent is <strong>relatively</strong> positioned and target is <strong>absolutely</strong> positioned:
```css
#dynode-parent {
    width: 1200px;
    height: 700px;
    position: relative; // parent should be relatively positioned
}

#dynode {
    width: 300px;
    height: 300px;
    position: absolute // target should be absolutely positioned
}
```

### Step 3
Import and mount `DynamicNode`:
```javascript
import DynamicNode from 'dynamic-node';

// initialize dynamic node
const dynode = new DynamicNode({
    element: 'dynode', // you can also pass an HTMLElement
    boundByParent: true
})

dynode.mount() // mount dynamic node
```