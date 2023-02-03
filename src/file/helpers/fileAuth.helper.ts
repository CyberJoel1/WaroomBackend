import { createClient} from '@supabase/supabase-js'

const url = ('https://jbtpjkjcxadmeecjohpq.supabase.co');
const key = ('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpidHBqa2pjeGFkbWVlY2pvaHBxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY3NDg5MTczMiwiZXhwIjoxOTkwNDY3NzMyfQ.BUOeItoMIslFEopr9MEHu32ciOkxMu3V79bXDuXG-G8');
console.log("url... "+url)

export const supabase = createClient(url,key);