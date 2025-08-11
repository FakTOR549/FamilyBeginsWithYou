from PIL import Image, ImageDraw
import numpy as np
import imageio
import math
import os

# Пути
base_img_path = "C:\Users\user\Documents\FamilyBeginsWithYou\FamilyBeginsWithYou\Wedding-Website-Template-main\assets\Margherite.png"
gif_path = "/mnt/data/loza_animation.gif"

# Загружаем исходное изображение
base_img = Image.open(base_img_path).convert("RGBA")
width, height = base_img.size

# Параметры анимации
frames_count = 30  # количество кадров
vine_color = (0, 100, 0, 255)  # зелёный цвет лоз
bg_color = (246, 242, 233, 255)  # #f6f2e9

frames = []

# Создание кадров
for i in range(frames_count):
    frame = Image.new("RGBA", (width, height), bg_color)

    # Масштаб лоз относительно шага
    scale = (i + 1) / frames_count

    # Создаём маску, постепенно открывая исходное изображение от углов к центру
    mask = Image.new("L", (width, height), 0)
    draw = ImageDraw.Draw(mask)

    # Радиус раскрытия
    radius = int(math.sqrt(width**2 + height**2) * scale / 2)

    # Четыре "луча" из углов
    for cx, cy in [(0, 0), (width, 0), (0, height), (width, height)]:
        draw.ellipse((cx - radius, cy - radius, cx + radius, cy + radius), fill=255)

    # Применяем маску
    frame = Image.composite(base_img, frame, mask)

    frames.append(frame)

# Сохраняем GIF
frames[0].save(
    gif_path,
    save_all=True,
    append_images=frames[1:],
    duration=100,
    loop=0,
    disposal=2
)

gif_path
