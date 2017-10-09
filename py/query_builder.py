class QueryBuilder:

    def __init__(self, mysql):
        self.mysql = mysql

    # Builds a SELECT statement to query
    # Returns the result set if successful and None if not

    def build_select(self, selectSet, table):
        conn = self.mysql.connection
        cursor = conn.cursor()

        selectQuery = "SELECT "

        for i in selectSet:
            selectQuery += "%s, " % i

        selectQuery = selectQuery[:-2]
        selectQuery += " FROM " + table

        try:
            cursor.execute(selectQuery)
            cursor.commit()
            data = cursor.fetchall()
            return data
        except:
            return None

    # Builds a INSERT statement to query
    # Returns True if successful and False if not.

    def build_insert(self, columns, values, table):
        insertQuery = "INSERT INTO %s (" % table
        conn = self.mysql.connection
        cursor = conn.cursor()

        for i in columns:
            insertQuery += "%s, " % i
        insertQuery = insertQuery[:-2]

        insertQuery += ") VALUES ("

        for i in values:
            insertQuery += "%s, " % i
        insertQuery = insertQuery[:-2]

        insertQuery += ")"

        try:
            cursor.execute(insertQuery)
            cursor.commit()
            return True
        except:
            return False

    # Builds a DELETE statement to query
    # Returns True if successful and False if not.

    def build_delete(self, deleteAll, conditions, table):
        conn = self.mysql.connection
        cursor = conn.cursor()

        if deleteAll == True:
            deleteQuery = "DELETE * FROM %s" % table
        else:
            deleteQuery = "DELETE FROM %s " % table

            for i in conditions:
                deleteQuery += i

        try:
            cursor.execute(deleteQuery)
            cursor.commit()
            return True
        except:
            return False
