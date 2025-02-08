import {useState, useEffect, useRef, useMemo} from 'react';
import {StyleProp, ViewStyle} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

type HeartActivityIndicatorProps = {
  value?: number;
  animationDuration?: number;
};

function HeartWithLiquidActivityIndicator(props: HeartActivityIndicatorProps) {
  const {value = 30, animationDuration = 7000} = props;
  const [valueInternal, setValueInternal] = useState<number>(value);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setWithAnimation(true);
      setValueInternal(100);
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const activityIndicatorStyle: StyleProp<ViewStyle> = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 100,
      paddingTop: 70,
      backgroundColor: 'white',
    }),
    [],
  );

  return (
    <HeartWithLiquidButton
      size={400}
      value={valueInternal}
      withAnimation={withAnimation}
      style={activityIndicatorStyle}
      borderColor="red"
      waveCount={2}
      waveHeightRatio={0.05}
      animationDuration={animationDuration}
      waterColor="red"
    />
  );
}

export default HeartWithLiquidActivityIndicator;
