use ttt;

drop procedure if exists ttt.create_seat_data;
delimiter #
create procedure ttt.create_seat_data()
wholeblock:begin

	declare max_section_id int unsigned default 58;

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
end #
delimiter ;

call create_seat_data();
drop procedure if exists ttt.create_seat_data;
