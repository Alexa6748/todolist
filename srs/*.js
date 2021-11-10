const isValid = (board, row, col, k) => {
  for (let i = 0; i < 9; i++) {
    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3)
    const n = 3 * Math.floor(col / 3) + i % 3
    if (board[row][i] === k || board[i][col] === k || board[m][n] === k) {
      return false
    }
  }
  return true
}

const sudokuSolver = (data) => {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (data[i][j] === '.') {
        for (let k = 1; k <= 9; k++) {
          if (isValid(data, i, j, `${k}`)) {
            data[i][j] = `${k}`
            if (sudokuSolver(data)) {
              return true
            } else {
              data[i][j] = '.'
            }
          }
        }
        return false
      }
    }
  }
  return true
}

// testing

// const board = [
//   ['.', '9', '.', '.', '4', '2', '1', '3', '6'],
//   ['.', '.', '.', '9', '6', '.', '4', '8', '5'],
//   ['.', '.', '.', '5', '8', '1', '.', '.', '.'],
//   ['.', '.', '4', '.', '.', '.', '.', '.', '.'],
//   ['5', '1', '7', '2', '.', '.', '9', '.', '.'],
//   ['6', '.', '2', '.', '.', '.', '3', '7', '.'],
//   ['1', '.', '.', '8', '.', '4', '.', '2', '.'],
//   ['7', '.', '6', '.', '.', '.', '8', '1', '.'],
//   ['3', '.', '.', '.', '9', '.', '.', '.', '.']
// ]
// sudokuSolver(board) // -> board updated by reference

export { sudokuSolver }

/**
 * Validate a given credit card number
 *
 * The core of the validation of credit card numbers is the Luhn algorithm.
 *
 * The validation sum should be completely divisible by 10 which is calculated as follows,
 * every first digit is added directly to the validation sum.
 * For every second digit in the credit card number, the digit is multiplied by 2.
 * If the product is greater than 10 the digits of the product are added.
 * This resultant digit is considered for the validation sum rather than the digit itself.
 *
 * Ref: https://www.geeksforgeeks.org/luhn-algorithm/
 */

const luhnValidation = (creditCardNumber) => {
  let validationSum = 0
  creditCardNumber.split('').forEach((digit, index) => {
    let currentDigit = parseInt(digit)
    if (index % 2 === 0) {
      // Multiply every 2nd digit from the left by 2
      currentDigit *= 2
      // if product is greater than 10 add the individual digits of the product to get a single digit
      if (currentDigit > 9) {
        currentDigit %= 10
        currentDigit += 1
      }
    }
    validationSum += currentDigit
  })

  return validationSum % 10 === 0
}

const validateCreditCard = (creditCardString) => {
  const validStartSubString = ['4', '5', '6', '37', '34', '35'] // Valid credit card numbers start with these numbers

  if (typeof creditCardString !== 'string') {
    throw new TypeError('The given value is not a string')
  }

  const errorMessage = `${creditCardString} is an invalid credit card number because `
  if (isNaN(creditCardString)) {
    throw new TypeError(errorMessage + 'it has nonnumerical characters.')
  }
  const creditCardStringLength = creditCardString.length
  if (!((creditCardStringLength >= 13) && (creditCardStringLength <= 16))) {
    throw new Error(errorMessage + 'of its length.')
  }
  if (!validStartSubString.some(subString => creditCardString.startsWith(subString))) {
    throw new Error(errorMessage + 'of its first two digits.')
  }
  if (!luhnValidation(creditCardString)) {
    throw new Error(errorMessage + 'it fails the Luhn check.')
  }

  return true
}

export { validateCreditCard }
/*! fly - v1.0.0 - 2015-03-23
* https://github.com/amibug/fly
* Copyright (c) 2015 wuyuedong; Licensed MIT */
(function ($) {
  $.fly = function (element, options) {
    // 默认值
    var defaults = {
      version: '1.0.0',
      autoPlay: true,
      vertex_Rtop: 20, // 默认顶点高度top值
      speed: 1.2,
      start: {}, // top, left, width, height
      end: {},
      onEnd: $.noop
    };

    var self = this,
      $element = $(element);

    /**
     * 初始化组件，new的时候即调用
     */
    self.init = function (options) {
      this.setOptions(options);
      !!this.settings.autoPlay && this.play();
    };

    /**
     * 设置组件参数
     */
    self.setOptions = function (options) {
      this.settings = $.extend(true, {}, defaults, options);
      var settings = this.settings,
        start = settings.start,
        end = settings.end;

      $element.css({marginTop: '0px', marginLeft: '0px', position: 'fixed'}).appendTo('body');
      // 运动过程中有改变大小
      if (end.width != null && end.height != null) {
        $.extend(true, start, {
          width: $element.width(),
          height: $element.height()
        });
      }
      // 运动轨迹最高点top值
      var vertex_top = Math.min(start.top, end.top) - Math.abs(start.left - end.left) / 3;
      if (vertex_top < settings.vertex_Rtop) {
        // 可能出现起点或者终点就是运动曲线顶点的情况
        vertex_top = Math.min(settings.vertex_Rtop, Math.min(start.top, end.top));
      }

      /**
       * ======================================================
       * 运动轨迹在页面中的top值可以抽象成函数 y = a * x*x + b;
       * a = curvature
       * b = vertex_top
       * ======================================================
       */

      var distance = Math.sqrt(Math.pow(start.top - end.top, 2) + Math.pow(start.left - end.left, 2)),
        // 元素移动次数
        steps = Math.ceil(Math.min(Math.max(Math.log(distance) / 0.05 - 75, 30), 100) / settings.speed),
        ratio = start.top == vertex_top ? 0 : -Math.sqrt((end.top - vertex_top) / (start.top - vertex_top)),
        vertex_left = (ratio * start.left - end.left) / (ratio - 1),
        // 特殊情况，出现顶点left==终点left，将曲率设置为0，做直线运动。
        curvature = end.left == vertex_left ? 0 : (end.top - vertex_top) / Math.pow(end.left - vertex_left, 2);

      $.extend(true, settings, {
        count: -1, // 每次重置为-1
        steps: steps,
        vertex_left: vertex_left,
        vertex_top: vertex_top,
        curvature: curvature
      });
    };

    /**
     * 开始运动，可自己调用
     */
    self.play = function () {
      this.move();
    };

    /**
     * 按step运动
     */
    self.move = function () {
      var settings = this.settings,
        start = settings.start,
        count = settings.count,
        steps = settings.steps,
        end = settings.end;
      // 计算left top值
      var left = start.left + (end.left - start.left) * count / steps,
        top = settings.curvature == 0 ? start.top + (end.top - start.top) * count / steps : settings.curvature * Math.pow(left - settings.vertex_left, 2) + settings.vertex_top;
      // 运动过程中有改变大小
      if (end.width != null && end.height != null) {
        var i = steps / 2,
          width = end.width - (end.width - start.width) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2),
          height = end.height - (end.height - start.height) * Math.cos(count < i ? 0 : (count - i) / (steps - i) * Math.PI / 2);
        $element.css({width: width + "px", height: height + "px", "font-size": Math.min(width, height) + "px"});
      }
      $element.css({
        left: left + "px",
        top: top + "px"
      });
      settings.count++;
      // 定时任务
      var time = window.requestAnimationFrame($.proxy(this.move, this));
      if (count == steps) {
        window.cancelAnimationFrame(time);
        // fire callback
        settings.onEnd.apply(this);
      }
    };

    /**
     * 销毁
     */
    self.destroy = function(){
      $element.remove();
    };

    self.init(options);
  };

  // add the plugin to the jQuery.fn object
  $.fn.fly = function (options) {
    return this.each(function () {
      if (undefined == $(this).data('fly')) {
        $(this).data('fly', new $.fly(this, options));
      }
    });
  };
})(jQuery);
