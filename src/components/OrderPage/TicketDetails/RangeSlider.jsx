import classNames from 'classnames';
import { useState, useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';

const railHeights = {
  s: 10,
  l: 19,
};

const handleHeights = {
  s: 18,
  l: 24,
};

export const HoursRangeSlider = (props) => {
  return (
    <RangeSlider
      min={0}
      max={24}
      step={1}
      size="s"
      markSuffix=":00"
      {...props}
    />
  );
};

export const RangeSlider = ({
  labelSlot,
  min = 0,
  max = 10000,
  step = 100,
  size = 'l',
  names,
  markSuffix = '',
  onRangeChange,
}) => {
  const { control } = useFormContext();

  const fromValue = useWatch({ control, name: names[0] });
  const toValue = useWatch({ control, name: names[1] });
  const [values, setValues] = useState([fromValue, toValue]);

  const minValue = Math.floor(min / step) * step;
  const maxValue = Math.ceil(max / step) * step;

  const onChange = (values) => {
    setValues(values);
  };

  const onAfterChange = (values) => {
    onRangeChange(names, values);
  };

  useEffect(() => {
    setValues([fromValue, toValue]);
  }, [fromValue, toValue]);

  return (
    <div className={classNames('range-slider', `range-slider__size_${size}`)}>
      {labelSlot}
      <Slider
        min={minValue}
        max={maxValue}
        range
        onChange={onChange}
        onAfterChange={onAfterChange}
        value={values}
        step={step}
        dotStyle={{ display: 'none' }}
        trackStyle={{
          backgroundColor: '#FFA800',
          height: railHeights[size],
        }}
        handleStyle={{
          borderColor: 'fff',
          height: handleHeights[size],
          width: handleHeights[size],
          backgroundColor: 'fff',
          border: 'none',
          opacity: 1,
          marginTop: size === 'l' ? -2.5 : -4,
        }}
        railStyle={{
          backgroundColor: '#3E3C41',
          height: railHeights[size],
          borderRadius: 8,
          border: '1px solid #C4C4C4',
        }}
        marks={{
          [minValue]: {
            label: `${minValue}${markSuffix}`,
            style: {
              fontSize: 16,
              color: '#E5E5E5',
            },
          },
          [values[0]]: {
            label: `${values[0]}${markSuffix}`,
            style: {
              fontSize: 16,
              color: '#E5E5E5',
            },
          },
          [values[1]]: {
            label: `${values[1]}${markSuffix}`,
            style: {
              fontSize: 16,
              color: '#E5E5E5',
            },
          },
          [maxValue]: {
            label: `${maxValue}${markSuffix}`,
            style: {
              fontSize: 16,
              color: '#E5E5E5',
            },
          },
        }}
      />
    </div>
  );
};
