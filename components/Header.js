import React, { Component } from 'react';
import { Animated, StyleSheet, View, RefreshControl } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { colors } from '../theme/colors'

const HEADER_MAX_HEIGHT = Math.round(hp('23%'));
const HEADER_MIN_HEIGHT = Math.round(hp('10%'));
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      scrollY: new Animated.Value(-HEADER_MAX_HEIGHT),
      refreshing: false
    };
  }

  render() {
    const scrollY = Animated.add(this.state.scrollY, HEADER_MAX_HEIGHT);

    const headerTranslate = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE],
      outputRange: [0, -HEADER_SCROLL_DISTANCE],
      extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0],
      extrapolate: 'clamp',
    });

    const titleScale = scrollY.interpolate({
      inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
      outputRange: [1, 1, 0.7],
      extrapolate: 'clamp',
    });

    const titleTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, HEADER_SCROLL_DISTANCE / 1.8],
        extrapolate: 'clamp',
    });

    const refreshControlComponent = (
        <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
                this.setState({ refreshing: true });
                setTimeout(() => this.setState({ refreshing: false }), 1000);
            }}
        />
    )

    return (
      <View style={styles.fill}>
        <Animated.ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.fill}
            scrollEventThrottle={16}
            scrollEnabled={this.props.disableScroll ? false : true}
            onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }],
                { useNativeDriver: true },
            )}
            refreshControl={this.props.disableRefresh ? false : refreshControlComponent}
          contentInset={{ top: HEADER_MAX_HEIGHT }}
          contentOffset={{ y: -HEADER_MAX_HEIGHT }}
        >
            {this.props.children}
        </Animated.ScrollView>
        <Animated.View
            pointerEvents="none"
            style={[
                styles.headerBackground,
                { transform: [{ translateY: headerTranslate }]},
            ]}
        >
            <Animated.View style={[styles.titleContainer, {transform: [{ translateY: titleTranslate }]}]}>
                <Animated.Text style={[styles.title, {transform: [{ scale: titleScale }]}]}>{this.props.navbarText || this.props.title}</Animated.Text>
            </Animated.View>
        </Animated.View>

        <Animated.View
            pointerEvents="none"
            style={[
                styles.header,
                {opacity: imageOpacity, transform: [{ translateY: headerTranslate }]},
            ]}
        >
            <Animated.View style={[styles.titleContainer, {transform: [{ translateY: titleTranslate }]}]}>
                <Animated.Text style={[styles.title, {transform: [{ scale: titleScale }]}]}>{this.props.title}</Animated.Text>
            </Animated.View>
        </Animated.View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  fill: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.headerMax,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.headerMin,
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: HEADER_MAX_HEIGHT
  },
  title: {
    color: colors.headerText,
    fontSize: 30,
    fontWeight: 'bold',
    justifyContent: 'center'
  }
});