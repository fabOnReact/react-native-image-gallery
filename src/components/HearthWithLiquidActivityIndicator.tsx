import {useState, useEffect} from 'react';
import {StyleSheet} from 'react-native';
import HeartWithLiquidButton from './HearthWithLiquidButton';

function HeartWithLiquidActivityIndicator() {
  const [value, setValue] = useState(30);
  const [withAnimation, setWithAnimation] = useState(false);

  useEffect(() => {
    // Set up an interval to increment the value every second
    const intervalId = setInterval(() => {
      console.log('TESTING ' + 'interval called');
      setWithAnimation(true);
      setValue(prevValue => {
        if (prevValue < 100) {
          return prevValue + 20;
        } else {
          return prevValue - 20;
        }
      });
    }, 1000);

    // Cleanup function to clear the interval if the component unmounts
    return () => clearInterval(intervalId);
  }, []);
  return (
    <HeartWithLiquidButton
      size={400}
      value={value}
      withAnimation={withAnimation}
      style={style.activitiyIndicator}
      borderColor="white"
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
    backgroundColor: 'black',
  },
});

export default HeartWithLiquidActivityIndicator;
