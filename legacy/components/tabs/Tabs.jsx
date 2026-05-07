import React, { useEffect, useId, useRef, useState } from 'react';
import './styles.css';
import Tab from '../tab/index.js';

function joinClassNames() {
  return Array.prototype.slice.call(arguments).filter(Boolean).join(' ');
}

function resolveSelectedValue(options, candidate) {
  if (candidate && options.some(function (o) { return o.value === candidate; })) {
    return candidate;
  }
  var firstEnabled = options.find(function (o) { return !o.disabled; });
  return firstEnabled ? firstEnabled.value : options[0] ? options[0].value : undefined;
}

function getEnabledIndexes(options, disabled) {
  if (disabled) return [];
  return options.reduce(function (indexes, option, index) {
    if (!option.disabled) indexes.push(index);
    return indexes;
  }, []);
}

function getNextIndex(indexes, currentIndex, direction) {
  if (indexes.length === 0) return undefined;
  var enabledPosition = indexes.includes(currentIndex) ? indexes.indexOf(currentIndex) : 0;
  var nextPosition = (enabledPosition + direction + indexes.length) % indexes.length;
  return indexes[nextPosition];
}

export default function Tabs(props) {
  var activationMode = props.activationMode || 'automatic';
  var className = props.className;
  var defaultValue = props.defaultValue;
  var disabled = props.disabled != null ? props.disabled : false;
  var onChange = props.onChange;
  var onKeyDown = props.onKeyDown;
  var options = props.options;
  var tabProps = props.tabProps;
  var value = props.value;

  var rest = Object.assign({}, props);
  delete rest.activationMode;
  delete rest.className;
  delete rest.defaultValue;
  delete rest.disabled;
  delete rest.onChange;
  delete rest.onKeyDown;
  delete rest.options;
  delete rest.tabProps;
  delete rest.value;

  var generatedId = useId().replace(/:/g, '');
  var tabRefs = useRef([]);
  var isControlled = value !== undefined;

  var _useState = useState(function () {
    return resolveSelectedValue(options, defaultValue);
  });
  var internalValue = _useState[0];
  var setInternalValue = _useState[1];

  useEffect(
    function () {
      if (!isControlled) {
        setInternalValue(function (currentValue) {
          return resolveSelectedValue(options, defaultValue != null ? defaultValue : currentValue);
        });
      }
    },
    [defaultValue, isControlled, options]
  );

  var resolvedValue = resolveSelectedValue(options, isControlled ? value : internalValue);
  var enabledIndexes = getEnabledIndexes(options, disabled);

  function selectTab(nextValue, event) {
    if (!isControlled) setInternalValue(nextValue);
    if (onChange) onChange(nextValue, event);
  }

  function focusTab(index, event) {
    var option = options[index];
    if (tabRefs.current[index]) tabRefs.current[index].focus();
    if (activationMode === 'automatic' && option && option.value !== resolvedValue) {
      selectTab(option.value, event);
    }
  }

  function handleKeyDown(event) {
    if (onKeyDown) onKeyDown(event);
    if (event.defaultPrevented) return;

    var focusedIndex = tabRefs.current.findIndex(function (node) { return node === event.target; });
    var activeIndex =
      focusedIndex >= 0
        ? focusedIndex
        : options.findIndex(function (option) { return option.value === resolvedValue; });
    var nextIndex;

    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, 1);
    }
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = getNextIndex(enabledIndexes, activeIndex, -1);
    }
    if (event.key === 'Home') {
      nextIndex = enabledIndexes[0];
    }
    if (event.key === 'End') {
      nextIndex = enabledIndexes[enabledIndexes.length - 1];
    }

    if (nextIndex === undefined) return;
    event.preventDefault();
    focusTab(nextIndex, event);
  }

  return (
    <div
      {...rest}
      aria-disabled={disabled || undefined}
      aria-orientation="horizontal"
      className={joinClassNames('rshb-legacy-tabs', className)}
      onKeyDown={handleKeyDown}
      role={rest.role != null ? rest.role : 'tablist'}
    >
      {options.map(function (option, index) {
        var selected = option.value === resolvedValue;
        var tabId = option.id != null ? option.id : 'tabs-' + generatedId + '-' + (index + 1);
        var mergedTabProps = Object.assign({}, tabProps);

        return (
          <Tab
            {...mergedTabProps}
            aria-controls={option.panelId}
            className={joinClassNames(
              'rshb-legacy-tabs__item',
              mergedTabProps.className
            )}
            disabled={disabled || option.disabled}
            id={tabId}
            key={option.id != null ? option.id : option.value}
            label={option.label}
            leadingIcon={option.leadingIcon}
            onClick={function (event) {
              if (mergedTabProps.onClick) mergedTabProps.onClick(event);
              if (!event.defaultPrevented && !disabled && !option.disabled) {
                selectTab(option.value, event);
              }
            }}
            ref={function (node) {
              tabRefs.current[index] = node;
            }}
            selected={selected}
            tabIndex={selected ? 0 : -1}
            trailingIcon={option.trailingIcon}
          />
        );
      })}
    </div>
  );
}
