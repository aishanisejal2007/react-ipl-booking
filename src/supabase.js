

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ogvmvcrqmdinxisfxluy.supabase.co';

const supabaseKey ='sb_publishable_McTMj8ajTl7IEnWHWZol3w_ai6CH5DT' ;

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
);
