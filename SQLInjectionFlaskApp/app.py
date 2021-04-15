from flask import Flask, redirect, url_for, request, render_template
from pymysql import connect, cursors
import subprocess

def restart_mysql_service():
   command = 'service mysql restart'
   process = subprocess.Popen(command.split(), stdout=subprocess.PIPE)
   output, error = process.communicate()

app = Flask(__name__)

restart_mysql_service()

@app.route('/success/<name>')
def success(name):
   return 'welcome %s' % name

@app.route('/')
def search_inventory():
   return render_template('search_inventory.html')

@app.route('/submit',methods = ['POST', 'GET'])
def submit():
   result=''
   item = request.form['item']
   if request.method == 'POST':
      
      connection = connect(host='localhost',
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
               
      
      return render_template('search_inventory.html', user=result)
   else:
      return render_template('search_inventory.html')

if __name__ == '__main__':
   app.run(host="0.0.0.0",port=5000,debug=True)
