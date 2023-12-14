import { Component } from '@angular/core';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isCollapsed = false;
  deleteShapeIndex: number | null = null;
  shapes: any[] = [];
  currentShape: any = null;
  isHovered: boolean = false;
  ngOnInit() {
    const savedShapes = localStorage.getItem('shapes');
    if (savedShapes) {
      this.shapes = JSON.parse(savedShapes);
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
    shape.style.left = `${newPosition.x}px`;
    shape.style.top = `${newPosition.y}px`;
    const shapeIndex = this.shapes.findIndex((s) => s === shape);
    if (shapeIndex > -1) {
      this.shapes[shapeIndex].style.left = `${newPosition.x}px`;
      this.shapes[shapeIndex].style.top = `${newPosition.y}px`;
    }
    localStorage.setItem('shapes', JSON.stringify(this.shapes));
    //
    if (shape.hoverEffect === 'zoom') {
      shape.style.transform = 'scale(1.4)';
    }
    //
    if (this.isHovered) {
      this.setHoverEffect(this.currentShape.hoverEffect);
    } else {
      shape.style.left = `${newPosition.x}px`;
      shape.style.top = `${newPosition.y}px`;
    }

    this.isHovered = false;
  }
  onShapeHover(shape: any) {
    this.currentShape = shape;
    this.isHovered = true;
  }
}
