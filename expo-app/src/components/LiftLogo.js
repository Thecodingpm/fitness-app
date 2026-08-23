import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

export function LiftBrandLogo({ size = 'large' }) {
  return (
    <View style={styles.brandLogoRow}>
      <Image
        source={require('../../assets/lift_logo.png')}
        style={size === 'small' ? styles.liftLogoImgSmall : styles.liftLogoImg}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  liftLogoImg: {
    width: 145,
    height: 48
  },
  liftLogoImgSmall: {
    width: 90,
    height: 28
  }
});
