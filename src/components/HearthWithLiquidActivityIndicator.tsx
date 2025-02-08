import {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

type HeartActivityIndicatorProps = {
  value?: number;
  animationDuration?: number;
};

function HeartWithLiquidActivityIndicator(props: HeartActivityIndicatorProps) {
  const [valueInternal, setValueInternal] = useState(props.value ?? 15);
  const [withAnimation, setWithAnimation] = useState(false);
  const animationDurationWithDefault = props.animationDuration ?? 7000;

  useEffect(() => {
    setWithAnimation(true);
    setValueInternal(100);
  }, []);

  return (
    <HeartWithLiquidButton
      size={400}
      value={valueInternal}
      withAnimation={withAnimation}
      style={style.activitiyIndicator}
      borderColor="red"
      waveCount={2}
      waveHeightRatio={0.05}
      animationDuration={animationDurationWithDefault}
      waterColor="red"
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
