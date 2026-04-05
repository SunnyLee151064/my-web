from PIL import Image, ImageDraw
import numpy as np
import os

# 生成音波图GIF的函数
def generate_sound_wave_gif(output_path, duration=3, fps=30, size=300, circle_radius=50):
    """
    生成一个圆形周围有音乐波形的GIF
    
    参数:
    output_path: 输出GIF的路径
    duration: GIF的持续时间（秒）
    fps: 每秒帧数
    size: 图片大小
    circle_radius: 中心圆形的半径
    """
    # 计算总帧数
    total_frames = duration * fps
    
    # 创建临时帧目录
    temp_dir = "temp_frames"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    try:
        frames = []
        
        for i in range(total_frames):
            # 创建新图像
            img = Image.new('RGB', (size, size), (0, 0, 0))
            draw = ImageDraw.Draw(img)
            
            # 绘制中心圆形
            center = (size // 2, size // 2)
            draw.ellipse(
                [center[0] - circle_radius, center[1] - circle_radius, 
                 center[0] + circle_radius, center[1] + circle_radius],
                fill=(50, 50, 50),
                outline=(100, 100, 100)
            )
            
            # 生成波形数据
            num_points = 100  # 波形点数量
            wave_amplitude = 30  # 波形振幅
            
            for j in range(num_points):
                # 计算角度
                angle = (j / num_points) * 2 * np.pi
                
                # 计算波形偏移量
                t = i / total_frames * 2 * np.pi
                wave_offset = wave_amplitude * np.sin(angle * 5 + t * 3)
                
                # 计算内外点坐标
                r1 = circle_radius + 10
                r2 = r1 + wave_offset
                
                x1 = center[0] + r1 * np.cos(angle)
                y1 = center[1] + r1 * np.sin(angle)
                x2 = center[0] + r2 * np.cos(angle)
                y2 = center[1] + r2 * np.sin(angle)
                
                # 绘制波形线
                draw.line([(x1, y1), (x2, y2)], fill=(0, 255, 255), width=2)
            
            # 保存当前帧
            frame_path = os.path.join(temp_dir, f"frame_{i:03d}.png")
            img.save(frame_path)
            frames.append(img)
        
        # 保存为GIF
        if frames:
            frames[0].save(
                output_path,
                save_all=True,
                append_images=frames[1:],
                duration=1000 // fps,
                loop=0
            )
        
        print(f"音波图GIF已生成: {output_path}")
        
    finally:
        # 清理临时文件
        for file in os.listdir(temp_dir):
            os.remove(os.path.join(temp_dir, file))
        os.rmdir(temp_dir)

# 生成音波图GIF
generate_sound_wave_gif(
    output_path="/Users/sunnylee/Documents/MyWeb/my-web/public/sound_wave.gif",
    duration=3,
    fps=30,
    size=300,
    circle_radius=50
)
