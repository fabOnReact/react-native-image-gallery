import {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

function HeartWithLiquidActivityIndicator() {
  const [value, setValue] = useState(30);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    setWithAnimation(true);
    setValue(100);
  }, []);
  return (
    <HeartWithLiquidButton
      size={400}
      value={value}
      withAnimation={withAnimation}
      style={style.activitiyIndicator}
      borderColor="red"
      waveCount={1}
      waveHeightRatio={0.01}
      animationDuration={30000}
      waterColor="blue"
    />
  );
}

const style = StyleSheet.create({
  activitiyIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});

export default HeartWithLiquidActivityIndicator;
