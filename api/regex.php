<?php

define("REGEX_EMAIL", "/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/");
define("REGEX_USERNAME", '/^(?=[a-zA-Z_])[a-zA-Z0-9_]{7,20}$/');
define("REGEX_PASSWORD", "/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,64}$/");
define("REGEX_NAMES", "/^[a-zA-Z ]+$/");