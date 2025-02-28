---
title: iOS 开发基础知识梳理
date: 2024-03-20
categories:
- 技术分享
tags:
- 技术
---
# iOS 开发基础知识梳理

## 1. Objective-C 语言基础

### 1.1 基本语法
- 头文件 (`.h`) 和 实现文件 (`.m`)
- 方法声明与实现：
  ```objc
  @interface Person : NSObject
  - (void)sayHello;
  @end

  @implementation Person
  - (void)sayHello {
      NSLog(@"Hello, World!");
  }
  @end
  ```

### 1.2 关键字
- `@interface` / `@implementation`：类的声明与实现  
- `@property` / `@synthesize` / `@dynamic`：属性声明、自动合成、动态合成  
- `self` / `super`：指向自身、调用父类方法  
- `id` / `instancetype`：通用对象类型，推荐 `instancetype` 作为返回值  
- `delegate` / `protocol`：协议与代理模式  

### 1.3 内存管理
- **MRC（手动引用计数）**
  - `retain` / `release` / `autorelease`
- **ARC（自动引用计数）**
  - `strong` / `weak` / `assign` / `copy`
- **循环引用问题**（`weak` 修饰，解决 `retain cycle`）

---

## 2. UIKit 和界面开发

### 2.1 UIView 与 UIViewController
- **视图控制器生命周期**
  ```objc
  - (void)viewDidLoad;
  - (void)viewWillAppear:(BOOL)animated;
  - (void)viewDidAppear:(BOOL)animated;
  - (void)viewWillDisappear:(BOOL)animated;
  - (void)viewDidDisappear:(BOOL)animated;
  ```

- **手写 UI vs Storyboard**
  - **代码方式**
    ```objc
    UILabel *label = [[UILabel alloc] initWithFrame:CGRectMake(20, 50, 200, 40)];
    label.text = @"Hello";
    [self.view addSubview:label];
    ```
  - **Storyboard / XIB**（可视化拖拽，适合小团队开发）

### 2.2 事件响应
- **target-action 机制**
  ```objc
  [button addTarget:self action:@selector(buttonTapped) forControlEvents:UIControlEventTouchUpInside];
  ```
- **手势识别**
  ```objc
  UITapGestureRecognizer *tap = [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(viewTapped)];
  [self.view addGestureRecognizer:tap];
  ```

---

## 3. 网络通信

### 3.1 NSURLSession
- **GET 请求**
  ```objc
  NSURL *url = [NSURL URLWithString:@"https://api.github.com/lalaluya/data"];
  NSURLSessionDataTask *task = [[NSURLSession sharedSession] dataTaskWithURL:url completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
      if (data) {
          NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
          NSLog(@"%@", json);
      }
  }];
  [task resume];
  ```

- **POST 请求**
  ```objc
  NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://api.github.com/lalaluya/login"]];
  request.HTTPMethod = @"POST";
  request.HTTPBody = [@"username=admin&password=123456" dataUsingEncoding:NSUTF8StringEncoding];
  ```

### 3.2 JSON 解析
- `NSJSONSerialization` 解析 JSON：
  ```objc
  NSDictionary *json = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
  ```

---

## 4. 数据存储

### 4.1 NSUserDefaults（轻量级存储）
```objc
[[NSUserDefaults standardUserDefaults] setObject:@"John" forKey:@"username"];
NSString *name = [[NSUserDefaults standardUserDefaults] stringForKey:@"username"];
```

### 4.2 文件存储
```objc
NSString *path = [NSHomeDirectory() stringByAppendingPathComponent:@"Documents/test.txt"];
[@"Hello, World!" writeToFile:path atomically:YES encoding:NSUTF8StringEncoding error:nil];
```

### 4.3 CoreData
```objc
NSFetchRequest *fetchRequest = [NSFetchRequest fetchRequestWithEntityName:@"Person"];
NSArray *result = [context executeFetchRequest:fetchRequest error:nil];
```

---

## 5. 调试与优化

### 5.1 Xcode 调试
- **使用断点（breakpoint）**
- `po` 命令打印对象：
  ```
  (lldb) po self.view
  ```

### 5.2 Instruments 性能分析
- **Leaks** 监测内存泄漏
- **Time Profiler** 分析 CPU 性能
- **Allocations** 监测内存分配

---
