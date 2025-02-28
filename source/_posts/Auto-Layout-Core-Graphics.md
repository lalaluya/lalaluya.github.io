---
title: Auto Layout、Core Graphics
date: 2024-03-20
categories:
- 技术分享
tags:
- iOS
- 技术
---

# Auto Layout 与 Core Graphics 技术详解

## 1. Auto Layout 基础

### 1.1 约束（Constraints）基础
- **代码方式创建约束**
  ```objc
  // 使用 NSLayoutConstraint
  NSLayoutConstraint *constraint = [NSLayoutConstraint 
      constraintWithItem:view1
      attribute:NSLayoutAttributeLeading
      relatedBy:NSLayoutRelationEqual
      toItem:view2
      attribute:NSLayoutAttributeLeading
      multiplier:1.0
      constant:20.0];
  [superview addConstraint:constraint];

  // 使用 Visual Format Language (VFL)
  NSDictionary *views = @{@"view1": view1, @"view2": view2};
  [superview addConstraints:[NSLayoutConstraint 
      constraintsWithVisualFormat:@"H:|-[view1]-[view2]-|"
      options:0 metrics:nil views:views]];
  ```

### 1.2 Auto Layout 动画
```objc
[UIView animateWithDuration:0.3 animations:^{
    constraint.constant = newValue;
    [view layoutIfNeeded];
}];
```

### 1.3 Safe Area 和布局指南
```objc
// iOS 11+ Safe Area
view.safeAreaLayoutGuide.topAnchor
view.safeAreaLayoutGuide.bottomAnchor
view.safeAreaLayoutGuide.leadingAnchor
view.safeAreaLayoutGuide.trailingAnchor
```

## 2. Core Graphics 绘图

### 2.1 基本绘图操作
```objc
- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    // 设置线条颜色
    [[UIColor redColor] setStroke];
    
    // 设置线宽
    CGContextSetLineWidth(context, 2.0);
    
    // 绘制直线
    CGContextMoveToPoint(context, 10, 10);
    CGContextAddLineToPoint(context, 100, 100);
    CGContextStrokePath(context);
}
```

### 2.2 绘制基本图形
```objc
// 绘制矩形
CGContextAddRect(context, CGRectMake(10, 10, 100, 100));

// 绘制圆形
CGContextAddEllipseInRect(context, CGRectMake(10, 10, 100, 100));

// 绘制圆角矩形
CGFloat radius = 10.0;
CGContextAddRoundedRect(context, CGRectMake(10, 10, 100, 100), radius);
```

### 2.3 渐变和阴影
```objc
// 创建渐变
CGGradientRef gradient = CGGradientCreateWithColors(
    CGColorSpaceCreateDeviceRGB(),
    (__bridge CFArrayRef)@[(id)[UIColor redColor].CGColor,
                          (id)[UIColor blueColor].CGColor],
    NULL);

// 绘制渐变
CGContextDrawLinearGradient(context,
    gradient,
    CGPointMake(0, 0),
    CGPointMake(100, 100),
    kCGGradientDrawsBeforeStartLocation);

// 添加阴影
CGContextSetShadowWithColor(context,
    CGSizeMake(2, 2),
    3.0,
    [UIColor blackColor].CGColor);
```

### 2.4 图片处理
```objc
// 绘制图片
UIImage *image = [UIImage imageNamed:@"example"];
[image drawInRect:CGRectMake(0, 0, 100, 100)];

// 图片裁剪
CGContextClipToRect(context, CGRectMake(0, 0, 50, 50));
[image drawAtPoint:CGPointZero];
```

## 3. 性能优化

### 3.1 Auto Layout 性能优化
- 减少约束数量
- 避免复杂的约束关系
- 适时使用 `translatesAutoresizingMaskIntoConstraints = NO`

### 3.2 Core Graphics 性能优化
- 避免频繁重绘
- 使用 `drawRect:` 的替代方案
- 缓存绘制结果

```objc
// 使用 CALayer 优化
- (void)optimizeDrawing {
    CAShapeLayer *shapeLayer = [CAShapeLayer layer];
    UIBezierPath *path = [UIBezierPath bezierPathWithRoundedRect:self.bounds
                                                  cornerRadius:10];
    shapeLayer.path = path.CGPath;
    shapeLayer.fillColor = [UIColor redColor].CGColor;
    [self.layer addSublayer:shapeLayer];
}
```

## 4. 实践案例

### 4.1 自适应卡片视图
```objc
@interface CardView : UIView
@property (nonatomic, strong) UILabel *titleLabel;
@property (nonatomic, strong) UIImageView *imageView;
@end

@implementation CardView

- (instancetype)initWithFrame:(CGRect)frame {
    if (self = [super initWithFrame:frame]) {
        [self setupViews];
        [self setupConstraints];
    }
    return self;
}

- (void)setupViews {
    self.titleLabel = [[UILabel alloc] init];
    self.titleLabel.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:self.titleLabel];
    
    self.imageView = [[UIImageView alloc] init];
    self.imageView.translatesAutoresizingMaskIntoConstraints = NO;
    [self addSubview:self.imageView];
}

- (void)setupConstraints {
    [NSLayoutConstraint activateConstraints:@[
        [self.titleLabel.topAnchor constraintEqualToAnchor:self.topAnchor constant:8],
        [self.titleLabel.leadingAnchor constraintEqualToAnchor:self.leadingAnchor constant:8],
        [self.titleLabel.trailingAnchor constraintEqualToAnchor:self.trailingAnchor constant:-8],
        
        [self.imageView.topAnchor constraintEqualToAnchor:self.titleLabel.bottomAnchor constant:8],
        [self.imageView.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
        [self.imageView.trailingAnchor constraintEqualToAnchor:self.trailingAnchor],
        [self.imageView.bottomAnchor constraintEqualToAnchor:self.bottomAnchor]
    ]];
}

@end
```

### 4.2 自定义绘制进度条
```objc
@interface ProgressView : UIView
@property (nonatomic, assign) CGFloat progress;
@end

@implementation ProgressView

- (void)setProgress:(CGFloat)progress {
    _progress = progress;
    [self setNeedsDisplay];
}

- (void)drawRect:(CGRect)rect {
    CGContextRef context = UIGraphicsGetCurrentContext();
    
    // 绘制背景
    [[UIColor lightGrayColor] setFill];
    CGContextFillRect(context, rect);
    
    // 绘制进度
    [[UIColor blueColor] setFill];
    CGRect progressRect = CGRectMake(0, 0, rect.size.width * self.progress, rect.size.height);
    CGContextFillRect(context, progressRect);
    
    // 添加渐变效果
    CGGradientRef gradient = CGGradientCreateWithColors(
        CGColorSpaceCreateDeviceRGB(),
        (__bridge CFArrayRef)@[(id)[UIColor colorWithWhite:1 alpha:0.2].CGColor,
                              (id)[UIColor clearColor].CGColor],
        NULL);
    
    CGContextDrawLinearGradient(context,
        gradient,
        CGPointMake(0, 0),
        CGPointMake(0, rect.size.height),
        0);
    
    CGGradientRelease(gradient);
}

@end