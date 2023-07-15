# Node.js Lv.5

## Q & A

1. 모든 로직을 Router에 구현하는 것이 아니라 Layered Architecture Pattern으로 프로젝트를 구현하였을 때, 어떠한 이점이 있을까요?  
   수정을 할 때 Router 전체가 아닌 필요한 부분만 수정 가능하여 유지보수에 좋습니다.  
   필요한 코드를 쉽게 찾을 수 있습니다.
   클래스와 함수로 분리해 필요한 기능을 분기할 수 있습니다.

2. Controller, Service, Repository Layer는 각각 어떤 역할을 가지고 있나요?  
   Controller : 클라이언트의 요청을 처리한 후 서버에서 처리된 결과를 반환  
   Service : 핵심적인 비즈니스 로직을 수행하고 실제 사용자가 원하는 요구사항을 구현  
   Repository : 데이터 베이스와 관련된 작업

## ERD

![ERD](https://i.postimg.cc/cLGd5pxV/draw-SQL-sansam-export-2023-07-15.png)

## API

https://verdantjuly.gitbook.io/hwlv4/
