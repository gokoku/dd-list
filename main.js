import './style.css'

import { fromEvent, combineLatest } from 'rxjs'
import { switchMap, takeUntil, map, tap, last } from 'rxjs/operators'

const mouseMove$ = fromEvent(document, 'mousemove')

const draggableElements = document.querySelectorAll('.draggable')
Array.from(draggableElements).forEach(createDraggableElement)

const areaElement = document.querySelector('#area')

function createDraggableElement(element) {
  const mouseDown$ = fromEvent(element, 'mousedown')
  const mouseUp$ = fromEvent(element, 'mouseup')

  const dragStart$ = mouseDown$
  const dragMove$ = dragStart$.pipe(
    switchMap((start) =>
      mouseMove$.pipe(
        map((moveEvent) => ({
          originalEvent: moveEvent,
          startOffsetX: start.offsetX,
          startOffsetY: start.offsetY,
        })),
        takeUntil(mouseUp$),
      ),
    ),
  )

  dragMove$.subscribe((move) => {
    const offsetX = move.originalEvent.x - move.startOffsetX
    const offsetY = move.originalEvent.y - move.startOffsetY
    element.classList.add('active')
    element.style.left = offsetX + 'px'
    element.style.top = offsetY + 'px'
    console.log(element.innerHTML, element.style.left, element.style.top)
  })

  const dragEnd$ = mouseUp$
  dragEnd$.subscribe((move) => {
    console.log('*********************', move.clientX, move.clientY)
    const x1 = areaElement.offsetLeft
    const x2 = x1 + areaElement.offsetWidth
    const y1 = areaElement.offsetTop
    const y2 = y1 + areaElement.offsetHeight
    if (
      move.clientX > x1 &&
      move.clientY < x2 &&
      move.clientY > y1 &&
      move.clientY < y2
    ) {
      areaElement.innerHTML = element.innerHTML
      console.log('===on===', element.innerHTML)
    }
    element.classList.remove('active')
  })
}
