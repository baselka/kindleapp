/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Platform,
  Dimensions,
  Text,
  StatusBar,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { Picker } from '@react-native-community/picker';
import RNFS from 'react-native-fs';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const ITEM_WIDTH = Math.round(width * 0.7);
const ITEM_HEIGHT = Math.round(ITEM_WIDTH * 3 / 4);
export default class app extends Component {

  constructor(props) {
    super(props);
    this.state = {
      content: [],
      selectedBook: 0,
      index: 0,

    }
  }
  readFile(book) {
    if (book == "0") {
      return
    }

    if (Platform.OS == 'ios') {
      RNFS.readFile(`${RNFS.MainBundlePath}/assets/${book}.txt`).then(res => {
        this.setState({ content: res.match(/.{1,100000}/g) })
      })
        .catch(err => {

          console.log(err.message, err.code);

        });
    } else if (Platform.OS == 'android') {
      RNFS.readFileAssets(`${book}.txt`).then(res => {
        this.setState({ content: res.match(/.{1,100000}/g) })
      })
        .catch(err => {

          console.log(err.message, err.code);

        });
    }

  }

  _renderItem({ item }) {
    return (
      <ScrollView style={styles.itemContainer}>
        <Text style={styles.content}>{item}</Text>
      </ScrollView>
    );
  }

  render() {
    const { selectedBook, content, index } = this.state
    return (


      <SafeAreaView>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedBook}
            style={styles.picker}
            textStyle={{fontSize: 25}}
            onValueChange={(itemValue, itemIndex) => {
              this.readFile(itemValue)
              this.setState({ selectedBook: itemValue })
            }
            }>
            <Picker.Item label="SELECT A BOOK" value="0" />
            <Picker.Item label="BOOK 1" value="sample_book1" />
            <Picker.Item label="BOOK 2" value="sample_book2" />
          </Picker>
        </View>
        {selectedBook != "0" ?
          <View>
            <Carousel
              ref={(c) => this.carousel = c}
              data={content}
              renderItem={this._renderItem}
              sliderWidth={width}
              itemWidth={ITEM_WIDTH}
              containerCustomStyle={styles.carouselContainer}
              inactiveSlideShift={0}
              onSnapToItem={(index) => this.setState({ index })}
              useScrollView={true}
            />
            <Text style={styles.counter}
            >
              {index}
            </Text>
          </View>
          : <Text style={styles.counter}>
            NO BOOK SELECTED
      </Text>}
      </SafeAreaView>
    )
  }
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemContainer: {
    width: wp('70%'),
    height: hp('60%'),
  },
  content: {
    marginHorizontal: 10,
    fontSize: Platform.OS == 'ios' ? 18 : 30
  },
  counter: {
    marginTop: 25,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  picker: {
    transform: Platform.OS == 'android' ?[
      { scaleX: 1.5 }, 
      { scaleY: 2.2 },
   ]:[],
    justifyContent: 'center',
    alignContent: 'center',
    width: width / 2,
    height: height / 4
  },
});

