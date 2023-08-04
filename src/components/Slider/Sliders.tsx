import React, { useState } from 'react';
import { Button, Pressable, Text, View, ViewProps } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import StrokeSlider from './StrokeSlider';
import ColorSlider from './ColorSlider';
import type { LinearGradientType } from '../../types';
import useDrawHook from '../DrawCore/useDrawHook';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  strokeContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginVertical:-15,
    borderColor: 'grey',
    borderRadius: 20,
    height: 35,
    borderWidth: 1,
    marginHorizontal: 20,
    // maxWidth: 400,
    alignSelf: 'center',
  },
  strokeWrapper: {
    flex: 1,
    height: 40,
    width:"100%",
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  currentColorContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    justifyContent: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    padding: 4,
  },
  currentColor: { width: 20, height: 20, borderRadius: 10 },
  colorContainer: {
    flex: 1,
    height: 40,
    marginHorizontal: 20,
    justifyContent: 'center',
    flexDirection:"row",
  },
});

const Sliders = ({
  linearGradient,
}: {
  linearGradient: React.ComponentType<LinearGradientType & ViewProps>;
}) => {
  const { strokeWidth, color } = useDrawHook();
  const [show, setShow] = useState(false)
  const styleStrokeColor = useAnimatedStyle(() => {
    return {
      borderWidth: strokeWidth!.value,
      borderColor: color!.value,
    };
    
  }, [strokeWidth, color]);
console.log("dfdsf", styleStrokeColor)
  const gradientColors = [
    '#000000', '#343a40', '#495057', '#c92a2a', '#a61e4d', '#862e9c', 
        '#5f3dc4', '#364fc7', '#1864ab', '#0b7285', '#087f5b', '#2b8a3e', '#5c940d', 
        '#e67700', '#d9480f'
  ];
  return (
    <View style={styles.strokeContainer}>
      <View style={styles.strokeWrapper}>
        <StrokeSlider minValue={2} maxValue={10} />
      </View>
      {/* <View style={styles.currentColorContainer}>
        <Animated.View style={[styles.currentColor, styleStrokeColor]} />
      </View> */}
      {/* <View style={styles.colorContainer}> */}
     
        {/* <Pressable onPress={()=> setShow(!show)}>
          <View><Text>Color</Text></View>
        </Pressable>
     {
      show && gradientColors?.map((color, index)=>
        <View
        key={index}
        style={{
          backgroundColor: color,
          width: 20,
          height: 20,
          borderRadius: 150,
        }}
      />
        )
     } */}
             {/* <ColorSlider linearGradient={linearGradient}/> */}

         {/* </View> */}
     
    </View>
  );
};

export default Sliders;
