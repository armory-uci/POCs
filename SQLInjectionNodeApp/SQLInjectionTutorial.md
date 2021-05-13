---
title: SQL Injection
serverId: sqlInjectionNode
language: node
---

# Lets try out SQL Injection!

## Explore

In the right most window, you can see a website that queries for items in an inventory. Let us try to get some information about the nature of query and get an idea about the SQL commands used internally.

We can do this simply by querying inventory items and analyzing its output. Let us input item **hammer** and submit.

We see the query output shows a list of items that have **hammer** in its name. This would mean the SQL command might have a wildcard matching that matches all items with hammer in it.

```sql
SELECT ?? FROM ?? WHERE ?? LIKE '%hammer%'
```

## Exploit

In the above command, we really don't have control over the entire SQL syntax. But the **'hammer'** within the wildcard symbols **%%** is where we can skillfully insert our commands to exploit SQL.

What would the SQL command look like if instead of **hammer** we put the following

```sql
hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);--
```

_Note the space in the end after `-- `_

The SQL command would now look like this:

```sql
SELECT ?? FROM ?? WHERE ?? LIKE '%hammer' UNION (SELECT TABLE_NAME, TABLE_SCHEMA FROM information_schema.tables);--%'
```

<br>

> **Note:** **INFORMATION_SCHEMA** provides access to database metadata, information about the MySQL server such as the name of a database or **table**, the data type of a column, or access privileges

You can now see rows with MySQL database metadata getting appended (UNION) along with the query result. This exposes critical database credentials and tables that can further be exploited to access more values and even remove tables.

# Mitigate

The given website is running on a Node.js server written in javascript. You can explore the server code using the terminal shown in the middle pane.

Navigate to `/app/routes/db.js` to see the server code and how SQL command is constructed.

In line number `17` of `db.js` we see the SQL command is constructed using a simple string concatenation:

```js
const sql_command = `select * from items where item_name like '%${req.body.item}%';`;
```

Plain string concatenation is always a bad idea when it comes to constructing SQL commands.

Its always a good idea to follow best practices to solve such problems.

## String formatting in Node.js via mysql library.

The problem with above string concatenated command was that the item name was never assumed to be a string as a whole. There were ways to bypass the escape sequence and become part of the main syntax through some clever positioning of characters such as `%` and `--`.

[mysql](https://github.com/mysqljs/mysql#escaping-query-values) has a fix for solving such ambiguities using **Escaping Query Values**. This allows our code to treat a string formatted variable to be a whole string no matter what escape sequences it may contain. This is done using **mysql.escape**.

The command can be executed in the following manner to treat the input texts as strings as a whole and to prevent it from getting combined with the SQL syntax.

```js
const sql_command = `select * from items where item_name like ${mysql.escape(
  '%' + req.body.item + '%',
)};`;
```

comment the `sql_command` at line `17` and uncomment the execute command in line `19`.

Trying the malicious SQL inject input no longer exposes critical database information.

<strong>Congratulations!!! you just learnt how to secure your Node.js server from SQLInjection</strong>
