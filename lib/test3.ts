class CRDTMap<K, V> {
  private values: Map<K, CRDTMapValue<V>>
  private vectorClock: number[]

  constructor() {
    this.values = new Map<K, CRDTMapValue<V>>()
    this.vectorClock = []
  }

  set(key: K, value: V): CRDTMap<K, V> {
    const vectorClock = this.vectorClock.map(value => value + 1)
    const newValue = new CRDTMapValue<V>(value, vectorClock)
    const currentValue = this.values.get(key)

    if (currentValue) {
      const mergedValue = CRDTMapValue.merge(currentValue, newValue)
      this.values.set(key, mergedValue)
    }
    else {
      this.values.set(key, newValue)
    }

    this.vectorClock = vectorClock

    return this
  }

  get(key: K): V | undefined {
    const mapValue = this.values.get(key)

    return mapValue?.value
  }

  delete(key: K): void {
    const vectorClock = this.vectorClock.map(value => value + 1)
    this.values.delete(key)
    this.vectorClock = vectorClock
  }

  merge(other: CRDTMap<K, V>): CRDTMap<K, V> {
    other.values.forEach((value, key) => {
      const currentValue = this.values.get(key)

      if (currentValue) {
        const mergedValue = CRDTMapValue.merge(currentValue, value)
        this.values.set(key, mergedValue)
      }
      else {
        this.values.set(key, value)
      }
    })

    this.vectorClock = CRDTMap.mergeVectorClocks(this.vectorClock, other.vectorClock)

    return this
  }

  private static mergeVectorClocks(vectorClock1: number[], vectorClock2: number[]): number[] {
    if (vectorClock1.length !== vectorClock2.length) {
      throw new Error('Vector clocks have different lengths')
    }

    const mergedVectorClock = vectorClock1.map((value, index) => Math.max(value, vectorClock2[index]))

    return mergedVectorClock
  }
}

class CRDTMapValue<V> {
  public value: V
  private vectorClock: number[]

  constructor(value: V, vectorClock: number[]) {
    this.value = value
    this.vectorClock = vectorClock
  }

  static merge<V>(value1: CRDTMapValue<V>, value2: CRDTMapValue<V>): CRDTMapValue<V> {
    const mergedVectorClock = CRDTMapValue.mergeVectorClocks(value1.vectorClock, value2.vectorClock)

    if (value1.vectorClock.every((value, index) => value === mergedVectorClock[index])) {
      return value1
    }

    if (value2.vectorClock.every((value, index) => value === mergedVectorClock[index])) {
      return value2
    }

    const mergedValue = mergeValues(value1.value, value2.value)

    return new CRDTMapValue<V>(mergedValue, mergedVectorClock)
  }

  private static mergeVectorClocks(vectorClock1: number[], vectorClock2: number[]): number[] {
    const mergedVectorClock = vectorClock1.map((value, index) => Math.max(value, vectorClock2[index]))

    return mergedVectorClock
  }
}

function mergeValues<V>(value1: V, value2: V): V {
  // Implement a custom merge function for your value type here
  return value1
}
