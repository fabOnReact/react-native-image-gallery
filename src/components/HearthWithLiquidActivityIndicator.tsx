import {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

type HeartActivityIndicatorProps = {
  value?: number;
};

function HeartWithLiquidActivityIndicator(props: HeartActivityIndicatorProps) {
  const [valueInternal, setValueInternal] = useState(30);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    setWithAnimation(true);
    setValueInternal(100);
  }, []);

  return (
    <HeartWithLiquidButton
      size={400}
      value={props.value ?? valueInternal}
      withAnimation={withAnimation}
      style={style.activitiyIndicator}
      borderColor="red"
      waveCount={2}
      waveHeightRatio={0.05}
      animationDuration={5000}
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
