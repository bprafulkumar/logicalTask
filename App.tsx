import React, {Component} from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface IProps {}
interface IState {
  gridCount: GridList[];
  isColorApplied: boolean;
  filterType: 'all' | 'fibonacci' | 'prime' | 'odd' | 'even';
  isResetButtonActive: boolean;
}
interface SS {}

interface GridList {
  id: string;
  gridCount: number;
  filterType: string;
}
export default class App extends Component<IProps, IState, SS> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      gridCount: [],
      isColorApplied: false,
      filterType: 'all',
      isResetButtonActive: false,
    };
  }
  componentDidMount() {
    let series = Array.from({length: 100}, (_, index) => index + 1);
    let requiredObj = series.map(item => {
      return {
        id: Date.now().toString(),
        gridCount: item,
        filterType: 'all',
      };
    });
    this.setState({gridCount: requiredObj});
  }

  handleRenderSequnece = (type: any) => {
    this.setState({
      isColorApplied: true,
      filterType: type,
    });
  };
  isFibonacci = (num: number) => {
    let initialNum = 0,
      secondFiNumber = 1,
      thirdFinNumber = 0;
    while (thirdFinNumber < num) {
      thirdFinNumber = initialNum + secondFiNumber;
      initialNum = secondFiNumber;
      secondFiNumber = thirdFinNumber;
    }
    return thirdFinNumber === num;
  };
  filterFibonacci = () => {
    let series = Array.from({length: 100}, (_, index) => index + 1);
    return series.filter(this.isFibonacci);
  };

  getFilteredGridCount = () => {
    const {gridCount, filterType} = this.state;
    let filteredCount = [...gridCount];
    if (filterType === 'odd') {
      filteredCount = filteredCount.filter(item => item.gridCount % 2 !== 0);
    } else if (filterType === 'even') {
      filteredCount = filteredCount.filter(item => item.gridCount % 2 === 0);
    } else if (filterType === 'prime') {
      const primeNumbers = this.filterPrime();
      filteredCount = filteredCount.filter(item =>
        primeNumbers.includes(item.gridCount),
      );
    } else if (filterType === 'fibonacci') {
      const fibonacciNumbers = this.filterFibonacci();
      filteredCount = filteredCount.filter(item =>
        fibonacciNumbers.includes(item.gridCount),
      );
    }
    return filteredCount;
  };
  layoutColorsWithConditions = (count: number) => {
    this;
    let evenNumber = count % 2 === 0;
    let oddNumbers = count % 2 !== 0;
    let fiSeries = [0, 1];
    const prime = this.filterPrime();
    for (let i = 0; i < this.state.gridCount.length; i++) {
      fiSeries.push(
        [fiSeries[fiSeries.length - 1], fiSeries[fiSeries.length - 2]].reduce(
          (acc, cur) => acc + cur,
        ),
      );
    }
    if (fiSeries.includes(count)) {
      return {
        backgroundColor: 'red',
      };
    } else if (prime.includes(count)) {
      return {
        backgroundColor: 'violet',
      };
    } else if (oddNumbers) {
      return {
        backgroundColor: 'green',
      };
    } else if (evenNumber) {
      return {
        backgroundColor: 'blue',
      };
    } else {
      return {
        backgroundColor: 'gray',
      };
    }
  };
  isPrime = (num: number) => {
    if (num === 1) return false;
    if (num === 2) return true;
    if (num % 2 == 0) return false;
    for (let i = 3; i <= Math.sqrt(num); i += 2) {
      if (num % i === 0) return false;
    }
    return true;
  };

  filterPrime() {
    let series = Array.from({length: 100}, (_, index) => index + 1);
    return series.filter(this.isPrime);
  }

  layoutOnTouch = (count: number) => {
    const {filterType} = this.state;
    if (filterType === 'fibonacci' && this.isFibonacci(count)) {
      return {backgroundColor: 'red'};
    } else if (filterType === 'prime' && this.isPrime(count)) {
      return {backgroundColor: 'violet'};
    } else if (filterType === 'odd' && count % 2 !== 0) {
      return {backgroundColor: 'green'};
    } else if (filterType === 'even' && count % 2 === 0) {
      return {backgroundColor: 'blue'};
    } else {
      return {backgroundColor: 'gray'};
    }
  };

  renderGripLayoutCount = ({item}: {item: GridList; index: number}) => {
    return (
      <View
        style={[
          styles.gridContainer,
          this.state.isColorApplied
            ? this.layoutOnTouch(item.gridCount)
            : this.layoutColorsWithConditions(item.gridCount),
        ]}>
        <Text style={styles.count}>{item.gridCount}</Text>
      </View>
    );
  };
  resetColors = () => {
    this.handleRenderSequnece('all');
    this.setState({isColorApplied: false, isResetButtonActive: true});
  };
  render() {
    return (
      <SafeAreaView style={styles.mainContainer}>
        <View style={styles.layoutColorDetails}>
          <Text
            onPress={() => this.resetColors()}
            style={[
              styles.colortext,
              this.state.isResetButtonActive &&
                this.state.filterType == 'all' &&
                styles.resetBtn,
            ]}>
            Reset colors
          </Text>
          <Text
            onPress={() => this.handleRenderSequnece('fibonacci')}
            style={[
              styles.colortext,
              this.state.filterType == 'fibonacci' && styles.fibonacciBtn,
            ]}>
            Red for fibonacci sequence numbers
          </Text>
          <Text
            onPress={() => this.handleRenderSequnece('prime')}
            style={[
              styles.colortext,
              this.state.filterType == 'prime' && {
                backgroundColor: 'violet',
                color: 'white',
              },
            ]}>
            Violet for prime numbers
          </Text>
          <Text
            onPress={() => this.handleRenderSequnece('odd')}
            style={[
              styles.colortext,
              this.state.filterType == 'odd' && styles.oddNumbersBtn,
            ]}>
            Green for odd numbers
          </Text>
          <Text
            onPress={() => this.handleRenderSequnece('even')}
            style={[
              styles.colortext,
              this.state.filterType == 'even' && styles.evenNumbersBtn,
            ]}>
            Blue for even numbers
          </Text>
        </View>
        <View style={styles.gridListContainer}>
          <FlatList
            numColumns={2}
            data={this.state.gridCount}
            renderItem={this.renderGripLayoutCount}
            initialNumToRender={10}
            keyExtractor={(_,index) => index.toString()}
            showsVerticalScrollIndicator={false}
            maxToRenderPerBatch={10}
            windowSize={21} 
            removeClippedSubviews={true}
            updateCellsBatchingPeriod={50}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  gridContainer: {
    width: 180,
    height: 200,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  count: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  layoutColorDetails: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  colortext: {
    fontWeight: 'bold',
    fontSize: 19,
    color: '#000',
    padding: 8,
    marginTop: 10,
    borderRadius: 15,
  },
  resetBtn: {backgroundColor: 'gray', color: 'white'},
  fibonacciBtn: {backgroundColor: 'red', color: 'white'},
  oddNumbersBtn:{
    backgroundColor: 'green',
    color: 'white',
  },
  evenNumbersBtn:{
    backgroundColor: 'blue',
    color: 'white',
  },
  gridListContainer:{flex: 1}
});
