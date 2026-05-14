from flask import Flask, send_from_directory

# 初始化 Flask
app = Flask(__name__, static_folder='dist', static_url_path='')

# 根路由直接返回 Vue 的 index.html
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# 启动服务
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)