// Core imports

use core::Zeroable;
use core::NumericLiteral;

mod errors {
    const PACKER_ELEMENT_IS_MISSING: felt252 = 'Packer: element is msising';
}

trait SizedPackerTrait<T, U, V> {
    fn get(packed: T, index: u8, size: V, len: u8) -> U;
    fn contains(packed: T, value: U, size: V, len: u8) -> bool;
    fn unpack(packed: T, size: V, len: u8) -> Array<U>;
    fn remove(packed: T, index: u8, size: V, len: u8) -> (T, U);
    fn replace(packed: T, index: u8, size: V, value: U, len: u8) -> (T, U);
    fn pack(unpacked: Array<U>, size: V) -> T;
}

impl SizedPacker<
    T,
    +Into<u8, T>,
    +TryInto<T, u8>,
    +NumericLiteral<T>,
    +PartialEq<T>,
    +Zeroable<T>,
    +Rem<T>,
    +Add<T>,
    +Mul<T>,
    +Div<T>,
    +Drop<T>,
    +Copy<T>,
    U,
    +PartialEq<U>,
    +Into<u8, U>,
    +Into<U, u8>,
    +Drop<U>,
    +Copy<U>,
    V,
    +Into<V, T>,
    +Drop<V>,
    +Copy<V>,
> of SizedPackerTrait<T, U, V> {
    fn get(packed: T, index: u8, size: V, len: u8) -> U {
        let unpacked: Array<U> = Self::unpack(packed, size, len);
        *unpacked.at(index.into())
    }

    fn contains(mut packed: T, value: U, size: V, len: u8) -> bool {
        let modulo: T = size.into();
        let mut index = 0;
        loop {
            if index == len {
                break false;
            }
            let raw: u8 = (packed % modulo).try_into().unwrap();
            if value == raw.into() {
                break true;
            }
            packed = packed / modulo;
            index += 1;
        }
    }

    fn unpack(mut packed: T, size: V, len: u8) -> Array<U> {
        let mut result: Array<U> = array![];
        let modulo: T = size.into();
        let mut index = 0;
        loop {
            if index == len {
                break;
            }
            let value: u8 = (packed % modulo).try_into().unwrap();
            result.append(value.into());
            packed = packed / modulo;
            index += 1;
        };
        result
    }

    fn remove(mut packed: T, index: u8, size: V, len: u8) -> (T, U) {
        // [Compute] Loop over the packed value and remove the value at the given index
        let mut removed = false;
        let mut removed_value: U = 0_u8.into();
        let mut result: Array<U> = array![];
        let mut idx: u8 = 0;
        let modulo: T = size.into();
        loop {
            if idx == len {
                break;
            }
            let value: u8 = (packed % modulo).try_into().unwrap();
            let item: U = value.into();
            if idx != index {
                result.append(item);
            } else {
                removed_value = item;
                removed = true;
            }
            idx += 1;
            packed = packed / modulo;
        };
        // [Check] Index not out of bounds
        assert(removed, errors::PACKER_ELEMENT_IS_MISSING);
        // [Return] The new packed value and the removed value
        (Self::pack(result, size), removed_value)
    }

    fn replace(mut packed: T, index: u8, size: V, value: U, len: u8) -> (T, U) {
        // [Compute] Loop over the packed value and remove the value at the given index
        let mut removed = false;
        let mut removed_value: U = 0_u8.into();
        let mut result: Array<U> = array![];
        let mut idx: u8 = 0;
        let modulo: T = size.into();
        loop {
            if idx == len {
                break;
            }
            let raw_value: u8 = (packed % modulo).try_into().unwrap();
            let item: U = raw_value.into();
            if idx != index {
                result.append(item);
            } else {
                result.append(value);
                removed_value = item;
                removed = true;
            }
            idx += 1;
            packed = packed / modulo;
        };
        // [Check] Index not out of bounds
        assert(removed, errors::PACKER_ELEMENT_IS_MISSING);
        // [Return] The new packed value and the removed value
        (Self::pack(result, size), removed_value)
    }

    fn pack(mut unpacked: Array<U>, size: V) -> T {
        let mut result: T = Zeroable::zero();
        let mut modulo: T = size.into();
        let mut offset: T = 1_u8.into();
        loop {
            match unpacked.pop_front() {
                Option::Some(value) => {
                    let value_u8: u8 = value.into();
                    result = result + offset.into() * value_u8.into();
                    if unpacked.is_empty() {
                        break;
                    }
                    offset = offset * modulo;
                },
                Option::None => { break; }
            }
        };
        result
    }
}
