import { Activity, Battery, BookOpen, Cable, CircuitBoard, Code2, Cog, Gamepad2, Lightbulb, Radio, Route, Scan, Settings2, Workflow } from 'lucide-react';

export const GROUPS = [
  { id: 'Drivetrain', zh: '传动系统', en: 'Drivetrain', icon: Route, color: 'green' },
  { id: 'Motors_and_MotorControllers', zh: '电机与控制器', en: 'Motors & controllers', icon: Cog, color: 'orange' },
  { id: 'Smart_Port_Devices', zh: '智能端口设备', en: 'Smart port devices', icon: Scan, color: 'purple' },
  { id: 'Brain', zh: '主控器', en: 'Brain', icon: CircuitBoard, color: 'blue' },
  { id: 'Controller', zh: '遥控器', en: 'Controller', icon: Gamepad2, color: 'orange' },
  { id: '3-Wire_Devices', zh: '三线设备', en: '3-wire devices', icon: Cable, color: 'green' },
  { id: 'Competition', zh: '竞赛控制', en: 'Competition', icon: Activity, color: 'purple' },
  { id: 'Logic', zh: '程序逻辑', en: 'Program logic', icon: Code2, color: 'blue' },
  { id: 'VEXlink', zh: 'VEXlink 通信', en: 'VEXlink', icon: Radio, color: 'green' },
  { id: 'CTE_Workcell', zh: 'CTE 工作站', en: 'CTE workcell', icon: Workflow, color: 'orange' },
  { id: 'Console', zh: '控制台', en: 'Console', icon: Settings2, color: 'purple' },
  { id: 'Essentials', zh: '参考指南', en: 'Getting started', icon: BookOpen, color: 'blue' },
];

export const QUICK = [
  { id: 'Motors_and_MotorControllers/motor_and_motor_group', name: 'motor', zh: '电机与电机组', en: 'Motor & motor group', icon: Cog, color: 'orange' },
  { id: 'Drivetrain/index', name: 'drivetrain', zh: '传动系统', en: 'Drivetrain', icon: Route, color: 'green' },
  { id: 'Smart_Port_Devices/Inertial_Sensor', name: 'inertial', zh: '惯性传感器', en: 'Inertial sensor', icon: Activity, color: 'purple' },
  { id: 'Brain/Screen', name: 'brain::lcd', zh: '主控器屏幕', en: 'Brain screen', icon: CircuitBoard, color: 'blue' },
];

export const TERMS = [
  ['Brain', '主控器', 'V5 机器人的主控设备；代码中的 Brain 通常是 brain 类的实例。', 'The V5 robot’s main computing device; Brain is typically an instance of the brain class.'],
  ['Controller', '遥控器', '用于操控机器人的手持输入设备，包含摇杆、按钮和屏幕。', 'A handheld input device with joysticks, buttons, and a screen.'],
  ['motor / motor_group', '电机 / 电机组', 'motor 控制单个电机；motor_group 协同控制多个电机。', 'motor controls one motor; motor_group controls several motors together.'],
  ['drivetrain / smartdrive', '传动系统 / 智能传动系统', 'smartdrive 在 drivetrain 基础上增加传感器支持，可按航向角或累计转角转向。', 'smartdrive extends drivetrain with sensor support for heading- and rotation-based turns.'],
  ['heading', '航向角', '方向角，通常在 0°（含）到 360°（不含）之间循环。不要与累计转角混淆。', 'A wrapped direction angle, usually from 0° inclusive to 360° exclusive. Distinct from rotation.'],
  ['rotation', '累计转角 / 旋转量', '可累计超过一周；具体指累计角度还是相对旋转量，应结合对应函数理解。', 'May accumulate beyond one revolution. Context determines whether it means a cumulative angle or a relative amount.'],
  ['position', '位置读数', '编码器的当前位置参考值；setPosition 修改读数基准，本身不驱动电机转动。', 'The encoder’s position reference. setPosition changes the reading; it does not itself move the motor.'],
  ['velocity', '速度 / 转速', '传动系统语境下为行驶速度，电机语境下为转速；始终结合单位理解。', 'Drive velocity for a drivetrain; rotational velocity for a motor. Always check the unit.'],
  ['torque', '扭矩', '电机产生的旋转作用，单位可为牛·米（Nm）或磅力·英寸（InLb）。', 'The motor’s twisting force, measured in Nm or inch-pounds (InLb).'],
  ['current', '电流', '电学读数，常以安培（amp）或额定值百分比表示。普通语境中的 current 仍表示“当前”。', 'An electrical reading in amps or percent of rated current. In ordinary prose, current can mean “present”.'],
  ['coast / brake / hold', '自由滑行 / 制动 / 保持位置', '三种停止模式。hold 会主动尝试保持位置，coast 允许电机自由滑行。', 'Three stopping modes. hold actively attempts to maintain position; coast lets the motor spin freely.'],
  ['waiting / non-waiting', '阻塞 / 非阻塞', '阻塞调用会等待动作结束才执行下一行；非阻塞调用启动动作后立即继续执行。', 'A waiting call delays the next line until completion; a non-waiting call starts the action and continues immediately.'],
  ['waitForCompletion', '是否等待完成', '对支持该参数的重载，true 通常表示等待动作结束；false 表示立即继续。计时型重载不一定提供此参数。', 'Where supported, true usually waits for the action; false continues immediately. Time-based overloads may not expose this parameter.'],
  ['spinFor / spinToPosition', '相对旋转 / 转到绝对位置', 'spinFor 按给定旋转量运动；spinToPosition 根据当前位置转到目标位置。', 'spinFor moves by a specified amount; spinToPosition moves from the current position to an absolute target.'],
  ['degree / revolution / rpm / dps', '度 / 圈 / 每分钟转数 / 每秒度数', '1 圈 = 360 度；1 rpm = 6 dps。不要把角度单位与角速度单位混用。', '1 revolution = 360 degrees; 1 rpm = 6 dps. Angle and angular velocity are different quantities.'],
  ['gear cartridge / gear ratio', '齿轮盒 / 齿轮传动比', '电机内部齿轮盒与外部传动比是不同配置；gearSetting 应匹配实际安装的齿轮盒。', 'The internal motor cartridge and external gearing are separate settings. gearSetting should match the installed cartridge.'],
  ['callback / event / thread', '回调函数 / 事件 / 线程', '回调函数在指定事件发生时调用；线程是独立的执行路径。', 'A callback is invoked when an event occurs; a thread is a separate path of execution.'],
  ['constructor / destructor', '构造函数 / 析构函数', '构造函数初始化对象；析构函数销毁对象并释放相关资源。', 'A constructor initializes an object; a destructor destroys it and releases its resources.'],
  ['overload', '函数重载', '同名函数可有多种参数组合；使用时应查看完整签名及对应参数说明。', 'Functions with the same name may accept different parameter combinations. Check each complete signature.'],
  ['Color Signature / Color Code', '颜色特征 / 颜色码', '视觉传感器使用的颜色检测配置。代码中的 signature、colordesc 等标识符保持原样。', 'Color detection configurations used by vision sensors. Identifiers such as signature and colordesc remain unchanged.'],
  ['3-Wire / Smart Port', '三线端口 / 智能端口', '两种不同的设备连接接口；创建对象时应使用对应的端口类型。', 'Two different device interfaces. Use the correct port type when constructing an object.'],
];

export const DEFAULT_SETTINGS = { language: 'zh' as const, theme: 'light' as const, motion: true, fontSize: 15, accent: 'jade' };
export const groupFor = (id: string) => GROUPS.find(g => g.id === id) ?? GROUPS[GROUPS.length - 1];
export const iconFor = (id: string) => groupFor(id).icon ?? Battery;
