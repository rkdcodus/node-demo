// 실습 1 : 일급객체 특징 보기
// JS의 함수는 일급객체이기 때문에 함수의 매개변수로 함수를 전달할 수 있다.
function foo(arg) {
  // JS의 함수는 일급객체이기 때문에 함수의 리턴값으로 사용할 수 있다.
  return arg;
}

function bar() {
  console.log("bar 출력");
}

// foo(bar)();
// output: bar 출력

// 살습 2 : 매개변수 실습
// 매개변수는 기본값을 지정할 수 있다. 인자를 넣어주지 않았을 경우 기본값이 사용된다. 기본값조차 안적으면 undefined
function 기본값매개변수(arg = 1) {
  console.log(arg);
}

//기본값매개변수();
// output : 1

// 실습3 : 매개변수 실습
// 스프레드 연산자를 사용해 나머지 매개변수를 사용할 수 있다. 배열로 묶어져서 나온다.
function rest파라미터(arg, ...rest) {
  console.log(rest);
}

// rest파라미터(1, 2, 3, 4);
// output : [2, 3, 4]

// 실습 4 : 함수 생성 방법
// 1. 함수 선언문
function foo1() {}

// 2. 함수 표현식 : 익명함수
const 익명함수 = function () {};

// 3. 함수 표현식 : 기명함수 -> 함수명으로 호출할 수 없음.
const 기명함수 = function foo2() {};

// 4. Function 생성자 함수
const foo3 = new Function();

// 5. 화살표 함수 표현식
const foo4 = () => {};

// 실습5 : 함수 사용 패턴
// 1. 즉시실행함수 -> 초기화 처리에 주로 사용
(function foo5() {
  console.log("즉시실행함수 정의하자마자 실행");
})();

// 2. 재귀함수 : 함수가 내부에서 자기자신을 호출. 탈출조건이 없으면 함수가 무한 호출됨.
function foo6(arg) {
  if (arg === 3) return; // 틸츨조건 필요

  console.log(arg);
  foo6(arg + 1);
}

// foo6(1);
// output:
// 1
// 2

// 3. 중첩함수
function foo7(arg) {
  function foo8() {
    console.log("중첩함수인 foo8 함수가 호출됨. ");
  }
  foo8();
}

// foo7();

// 4. 콜백함수
function foo9(arg) {
  arg();
}

foo9(() => {
  console.log("보통 콜백함수는 화살표함수로 씀.");
});
