# Lets try out SQL Injection!


## Explore

In the right most window, you can see a website that queries for items in an inventory. Let us try to get some information about the nature of query and get an idea about the SQL commands used internally. 

We can do this simply by querying inventory items and analyzing its output.  Let us input item **hammer** and submit.

We see the query output shows a list of items that have **hammer** in its name. This would mean the SQL command might have a wildcard matching that matches all items with hammer in it. 

`SELECT ?? FROM ?? WHERE ?? LIKE '%hammer%'`


## Exploit

In the above command, we really don't have control over the entire SQL syntax. But the **'hammer'** within the wildcard symbols **%%** is where we can skillfully insert our commands to exploit SQL. 

What would the SQL command look like if instead of **hammer** we put the following

`hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);--` 

The SQL command would now look like this:

`SELECT ?? FROM ?? WHERE ?? LIKE '%hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);--%'`
<br>

> **Note:** **INFORMATION_SCHEMA** provides access to database metadata, information about the MySQL server such as the name of a database or **table**, the data type of a column, or access privileges

You can now see rows with MySQL database metadata getting appended (UNION) along with the query result. This exposes critical database credentials and tables that can further be exploited to access more values and even remove tables.

# Mitigate

The given website is running on a flask server written in Python. You can explore the server code using the terminal shown in the middle pane. 

Navigate to `/server/path/app.py` to see the server code and how SQL command is constructed.

In line number `42` of `app.py`we see the SQL command is constructed using a simple string concatenation:

`sql_command = "select * from items where item_name like '%%"+item+"%'"` 

Plain string concatenation is always a bad idea when it comes to constructing SQL commands.

Its always a good idea to follow best practices to solve such problems. Python ([PEP 249](http://www.python.org/dev/peps/pep-0249/)) has suggestions on how queries should be executed for various db operations requirements. 

## String formatting in python
The problem with above string concatenated command was that the item name was never assumed to be a string as a whole. There were ways to bypass the escape sequence and become part of the main syntax through some clever positioning of characters such as `%` and `--`. 

Python has a fix for solving such ambiguities using **string formatting**. This allows our code to treat a string formatted variable to be a whole string no matter what escape sequences it may contain. This is done using **%s**. 

The command can be executed in the following manner to treat the input texts as strings as a whole and to prevent it from getting combined with the SQL syntax.

`cursor.execute("SELECT * FROM items WHERE item_name LIKE %s ''", ("%"+item+"%",))`

Remove the `sql_command` at line `42` and replace the execute command in line `45` with the above. 

Trying the malicious SQL inject input no longer exposes critical database information. 

<strong>Congratulations!!! you just learnt how to secure your python server from SQLInjection</strong>