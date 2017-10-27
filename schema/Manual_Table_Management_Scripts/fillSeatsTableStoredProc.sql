# This script is designed to build rows of "seat" data into the seats table, and makes the following assumptions:
#
# First, we know there are 58 sections of the arena in our test database
# Some of those sections are "lower" sections, while others are "upper" sections.
# Sections with section_id's 1-24 are "lower" sections, while sections_id's 25-58 are "upper" sections.
#
# For our test data, we will say that all of the "lower" sections of the arena will have 23 rows in them,
# while the "upper" sections of the arena will have 15 rows in them
# 
# We will also say that all of the "lower" rows will have 20 seats in them,
# while the "upper" rows will have 22 seats in them.
#
# row_id's 1-552 are in the "lower" sections while row_id's 553-1062 are in the "upper" sections.
# 
# This script builds seat data in according to this pattern:
# For row_id's 1-552, there are 20 seats that are created for each row.
# For row_id's 553-1062, there are 22 seats that are created for each row.
# Each seat gets its own unique seat_id (derived from a running incrementing counter) and a seat num for the row it is in.
# 
# 10-27-17
# Derek Gaffney
# 
use ttt;

drop procedure if exists ttt.create_seat_data;
delimiter //
create procedure ttt.create_seat_data()
wholeblock:begin

	declare max_lower_row_id int unsigned default 552;
	declare max_upper_row_id int unsigned default 1062;
	declare max_row_id int unsigned default 1062;

	declare max_lower_seat_num int unsigned default 20;
	declare max_upper_seat_num int unsigned default 22;

	declare curr_seat_id int default 1;
    
	declare i int default 0;
	declare j int default 0;
    
	set i = 1;
	set j = 1;

	truncate ttt.seats;

	start transaction;
		while i <= max_row_id do
				if i <= max_lower_row_id then
					set j = 1;
					while j <= max_lower_seat_num do
						insert into ttt.seats (row_id, seat_id, seat_num) values (i, curr_seat_id, j);
						set j = j + 1;
                        set curr_seat_id = curr_seat_id + 1;
					end while;
				elseif i <= max_upper_row_id then
					set j = 1;
                    while j <= max_upper_seat_num do
						insert into ttt.seats (row_id, seat_id, seat_num) values (i, curr_seat_id, j);
                        set j = j + 1;
                        set curr_seat_id = curr_seat_id + 1;
					end while;
				end if;
			set i = i + 1;
		end while;
	commit;
end //
delimiter ;

call create_seat_data();
drop procedure if exists ttt.create_seat_data;
