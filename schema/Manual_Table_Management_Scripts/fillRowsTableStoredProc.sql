# This script is designed to build rows of "row" data into the rows table, and makes the following assumptions:
#
# First, we know there are 58 sections of the arena in our test database
# Some of those sections are "lower" sections, while others are "upper" sections.
# Sections with section_id's 1-24 are "lower" sections, while sections_id's 25-58 are "upper" sections.
#
# For our test data, we will say that all of the "lower" sections of the arena will have 23 rows in them,
# while the "upper" sections of the arena will have 15 rows in them
# These values are just average values, and may be changed if we feel like it.
# If we do decide to change them, they can be set in this script as variables 'max_lower_row_num' and 'max_upper_row_num'
# 
# This script builds row data in according to this pattern:
# For section_id's 1-24, there are 23 rows that are created for each section.
# For section_id's 25-58, there are 15 rows that are created for each section.
# Each row gets its own unique row_id (derived from a running incrementing counter) and a row num for the section it is in.
# 
# 10-27-17
# Derek Gaffney
# 
use ttt;

drop procedure if exists ttt.create_row_data;
delimiter //
create procedure ttt.create_row_data()
wholeblock:begin

	declare max_section_id int unsigned default 58;
    declare max_lower_section_id int unsigned default 24;
    declare max_upper_section_id int unsigned default 58;

	declare max_lower_row_num int unsigned default 23;
	declare max_upper_row_num int unsigned default 15;

	declare curr_row_id int default 1;
    
	declare i int default 0;
	declare j int default 0;
    
	set i = 1;
	set j = 1;

	truncate ttt.rows;

	start transaction;
		while i <= max_section_id do
				if i <= max_lower_section_id then
					set j = 1;
					while j <= max_lower_row_num do
						insert into ttt.rows (section_id, row_id, row_num) values (i, curr_row_id, j);
						set j = j + 1;
                        set curr_row_id = curr_row_id + 1;
					end while;
				elseif i <= max_upper_section_id then
					set j = 1;
                    while j <= max_upper_row_num do
						insert into ttt.rows (section_id, row_id, row_num) values (i, curr_row_id, j);
                        set j = j + 1;
                        set curr_row_id = curr_row_id + 1;
					end while;
				end if;
			set i = i + 1;
		end while;
	commit;
end //
delimiter ;

call create_row_data();
drop procedure if exists ttt.create_row_data;
