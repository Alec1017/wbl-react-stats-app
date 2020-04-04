### Made a tweak to react-native-chart-kit

Go into node_modules/react-native-chart-kit/src/abstract-chart.js

Edit this block:

```javascript
calcScaler = data => {
    if (this.props.fromZero) {
      return Math.max(...data, 0) - Math.min(...data, 0) || 1;
    } else {
      return Math.max(...data) - Math.min(...data) || 1;
    }
  };
```

and change to:

```javascript
calcScaler = data => {
    if (this.props.fromZero) {
      return Math.max(...data, 1, 0) - Math.min(...data, 0) || 1;
    } else {
      return Math.max(...data, 1) - Math.min(...data) || 1;
    }
  };
```
