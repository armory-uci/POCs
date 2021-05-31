from flask import Flask, redirect, url_for, request, render_template
from pymysql import connect, cursors
from flask_cors import CORS
import subprocess


app = Flask(__name__)
CORS(app)


def restart_mysql_service():
    command = 'service mysql restart'
    process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
    output, error = process.communicate()

restart_mysql_service()

@app.route('/success/<name>')
def success(name):
    return 'welcome %s' % name

@app.route('/')
def search_inventory():
    return render_template('search_inventory.html', search_result=[{}])

def getSearchResults(item):
    try:
        connection = connect(host='',
                                user='root',
                                password='mysqlroot',
                                database='inventory',
                                cursorclass=cursors.DictCursor)
        with connection:
            with connection.cursor() as cursor:
                # select * from items where name like '%hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);-- %'
                # hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);--
                sql_command = "select * from items where item_name like '%%"+item+"%'"
                cursor.execute(sql_command)
                result = cursor.fetchall()
                if not result: result = [{}]
        return { "success": True, "result": result }
    except Exception as e:
        return { "success": False, "error": e }

@app.route('/submit', methods=['POST', 'GET'])
def submit():
    item = request.form['item']
    if request.method == 'POST':
        searchRes = getSearchResults(item)
        if searchRes["success"]:
            return render_template('search_inventory.html', search_result=searchRes["result"])
        else:
            return render_template('search_inventory.html', search_result=[{"error": str(searchRes["error"])}])
    else:
        return render_template('search_inventory.html', search_result=[{}])

@app.route('/status', methods=['GET'])
def getProblemStatus():
    status = { "solved": False }
    item = "hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);-- "
    searchRes = getSearchResults(item)
    if not searchRes["success"] or not searchRes["result"]: return status

    status["solved"] = not searchRes["result"][0]
    return status

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)

