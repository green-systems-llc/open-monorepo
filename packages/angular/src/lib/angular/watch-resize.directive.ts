// Angular.
import {
  Output,
  inject,
  OnDestroy,
  Directive,
  ElementRef,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

// Green systems.
import { Size } from '@green-systems/core';

@Directive({
  selector: '[gsWatchSize]',
  standalone: true,
})
export class WatchResizeDirective implements AfterViewInit, OnDestroy {
  @Output() sizeChange = new EventEmitter<Size>();

  private resizeObserver!: ResizeObserver;
  private readonly element = inject(ElementRef);

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const height = entry.target.clientHeight;
        const width = entry.target.clientWidth;
        this.sizeChange.emit({ width, height });
      }
    });

    // Start observing the element
    this.resizeObserver.observe(this.element.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }
}
