export const inputRange = [0, 1, 2, 3, 8, 24];

/*
inputRange = [0, 1, 2, 3, 8, 24] means you want to create an animation over the course of
24 frames.

Let's say you want to create a simple animation where a box moves from the left side of 
the screen to the right side of the screen over the course of 24 frames. To achieve this, 
you can use an Animated.Value object to represent the position of the box along the x-axis.

```js
const positionX = new Animated.Value(0);
```

This creates a new Animated.Value object called positionX with an initial value of 0, 
which represents the starting position of the box on the x-axis.

Here's what each value in the inputRange array represents:

0: The starting frame of the animation (i.e., the box is at its starting position on the left side of the screen)
1: The box has moved slightly to the right
2: The box has moved further to the right
3: The box has moved even further to the right
8: The box is now near the middle of the screen
24: The box has reached its final position on the right side of the screen

```bash
const boxPosition = positionX.interpolate({
  inputRange: [0, 1, 2, 3, 8, 24],
  outputRange: [0, 50, 100, 150, 200, 350] // These represent the position of the box on the x-axis at each frame.
});
```

The interpolate() method will return values:
When the value of positionX is 0, the output value of boxPosition will be 0, 
When the value of positionX is 1, the output value of boxPosition will be 50, 
*/
