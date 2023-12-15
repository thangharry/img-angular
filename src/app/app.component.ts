import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  deleteShapeIndex: number | null = null;
  shapes: any[] = [];
  currentShape: any = null;
  isHovered: boolean = false;
  innerContentElement: ElementRef<HTMLElement> | undefined;
  @ViewChild('innerContent', { static: true }) innerContent:
    | ElementRef
    | undefined;

  ngAfterViewInit() {
    // Thêm kiểm tra để đảm bảo innerContentElement không phải là undefined
    if (this.innerContent) {
      this.innerContentElement = this.innerContent.nativeElement;
    }
  }
  ngOnInit() {
    console.log('ngOnInt called');
    const savedShapes = localStorage.getItem('shapes');
    console.log('Saved Shapes:', savedShapes);
    if (savedShapes) {
      this.shapes = JSON.parse(savedShapes);
    }
    // Lấy tham chiếu đến phần tử "inner-content"
    if (this.innerContent) {
      this.innerContentElement = this.innerContent.nativeElement;
    }
  }

  createShape(shape: string) {
    let newShape:
      | {
          style: { [key: string]: string };
          hoverEffect?: string;
        }
      | undefined;

    const left = `${this.shapes.length * 10}px`;
    const top = `${this.shapes.length * 10}px`;
    switch (shape) {
      case 'square':
        newShape = {
          style: {
            width: '50px',
            height: '50px',
            backgroundColor: 'red',
            // position: 'absolute',
            left: left,
            top: top,
          },
          hoverEffect: 'none',
        };
        break;
      case 'circle':
        newShape = {
          style: {
            width: '50px',
            height: '50px',
            backgroundColor: 'red',
            borderRadius: '50%',
            // position: 'absolute',
            left: left,
            top: top,
          },
          hoverEffect: 'none',
        };
        break;
      case 'rounded':
        newShape = {
          style: {
            width: '50px',
            height: '50px',
            backgroundColor: 'red',
            borderRadius: '10px',
            // position: 'absolute',
            left: left,
            top: top,
          },
          hoverEffect: 'none',
        };
        break;
      default:
        newShape = undefined;
    }

    if (newShape) {
      this.shapes.push(newShape);
      console.log('Shapes:', this.shapes); // Log shapes array to the console
      this.currentShape = newShape;
      localStorage.setItem('shapes', JSON.stringify(this.shapes));
      console.log('Shapes after creating:', this.shapes);
      // newShape.showDelete = false;
    }
  }

  setHoverEffect(effect: string) {
    if (this.currentShape) {
      this.currentShape.hoverEffect = effect;
      setTimeout(() => {
        localStorage.setItem('shapes', JSON.stringify(this.shapes));
      });
    }
  }

  deleteShape() {
    if (this.deleteShapeIndex !== null) {
      this.shapes.splice(this.deleteShapeIndex, 1); // Xóa hình dạng
      localStorage.setItem('shapes', JSON.stringify(this.shapes)); // Cập nhật bộ nhớ cục bộ
      this.deleteShapeIndex = null; // Đặt lại chỉ mục xóa
      this.currentShape = null; // Đặt lại hình dạng hiện tại
    }
  }

  onShapeClick(shape: any) {
    this.currentShape = shape;
    this.isHovered = true;
    this.deleteShapeIndex = this.shapes.indexOf(shape);
  }

  onDragStart(shape: any) {
    this.isHovered = false;
    const index = this.shapes.indexOf(shape);
    this.onShapeClick(shape);
  }

  onDragEnd(shape: any, event: CdkDragEnd) {
    const newPosition = event.source.getFreeDragPosition();
    // const distanceX = event.distance.x;
    // const distanceY = event.distance.y;
    const shapeIndex = this.shapes.findIndex((s) => s === shape);
    // shape.style.left = `${parseFloat(shape.style.left) + distanceX}px`;
    // shape.style.top = `${parseFloat(shape.style.top) + distanceY}px`;

    if (shapeIndex > -1) {
      // this.shapes[shapeIndex].style.left = `${
      //   parseFloat(shape.style.left) + distanceX
      // }px`;
      // this.shapes[shapeIndex].style.top = `${
      //   parseFloat(shape.style.top) + distanceY
      // }px`;
      if (this.innerContentElement && this.innerContentElement.nativeElement) {
        // Lấy kích thước của phần tử "inner-content"
        const containerRect =
          this.innerContentElement.nativeElement.getBoundingClientRect();

        // Kiểm tra và điều chỉnh vị trí nếu hình vượt quá biên
        const adjustedPosition = {
          x: Math.min(Math.max(newPosition.x, 0), containerRect.width - 50),
          y: Math.min(Math.max(newPosition.y, 0), containerRect.height - 50),
        };

        this.shapes[shapeIndex].style.left = `${adjustedPosition.x}px`;
        this.shapes[shapeIndex].style.top = `${adjustedPosition.y}px`;

        localStorage.setItem('shapes', JSON.stringify(this.shapes));
      }

      this.shapes[shapeIndex].style.left = `${newPosition.x}`;
      this.shapes[shapeIndex].style.top = `${newPosition.y}`;
      localStorage.setItem('shapes', JSON.stringify(this.shapes));
    }
    //
    // if (shape.hoverEffect === 'zoom') {
    //   shape.style.transform = 'scale(1.4)';
    // }
    //
    console.log('Updated Shapes:', this.shapes);
    if (this.isHovered) {
      this.setHoverEffect(this.currentShape.hoverEffect);
    } else {
      shape.style.left = `${newPosition.x}px`;
      shape.style.top = `${newPosition.y}px`;
    }

    this.isHovered = false;
  }
}
