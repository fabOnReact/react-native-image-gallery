import {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

function HeartWithLiquidActivityIndicator({value}) {
  const [valueInternal, setValueInternal] = useState(30);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    setWithAnimation(true);
    setValueInternal(100);
  }, []);

  return (
    <HeartWithLiquidButton
      size={400}
      value={value ?? valueInternal}
      withAnimation={withAnimation}
      style={style.activitiyIndicator}
      borderColor="red"
      waveCount={1}
      waveHeightRatio={0.01}
      animationDuration={5000}
      waterColor="blue"
    />
  );
}

const style = StyleSheet.create({
  activitiyIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
    paddingTop: 50,
    backgroundColor: 'white',
  },
});

export default HeartWithLiquidActivityIndicator;
