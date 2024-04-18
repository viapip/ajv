import * as Gun from 'gun/gun';
import * as vfs from 'sack.vfs';

const DEBUG = false;

const rel_ = Gun.val.rel._ as '#';
const val_ = Gun.obj.has._ as '.';
const node_ = Gun.node._ as '_';
const state_ = Gun.state._ as '>';
const soul_ = Gun.node.soul._ as '#';

const ACK = '@' as '@';
const SEQ = '#' as '#';

Gun.on('opt', (ctx: any) => {
  this.to.next(ctx);
  if (ctx.once) {
    return;
  }
  const opt = ctx.opt.db || (ctx.opt.db = {});
  // opt.file = opt.file || ('file:gun.db?nolock=1');
  opt.file = opt.file || ('gun.db');
  const gun = ctx.gun;
  if (!ctx.gun) {
    console.log('Failed to open database:', opt.file);

    return;
  }
  // client.transaction();
  const client = vfs.Sqlite(opt.file);
  client.makeTable(`create table record (
			soul char,
			field char,
			value char,
			relation char,
			state char,
			constraint record_unique unique(soul,field)
	             )`);

  client.do('create index if not exists soul_index on record(soul)');
  // client.do( "PRAGMA mmap_size=16777216" );
  client.do('PRAGMA journal_mode=PERSIST');
  // client.do( "PRAGMA journal_mode=WAL" );
  client.do('PRAGMA synchronous = 0'); // necessary for perf!
  if (opt.exclusive) {
    client.do('PRAGMA locking_mode = EXCLUSIVE');
  }

  // client.do( "create index if not exists soul_field_index on record(soul,field)");
  // client.commit();
  // client.autoTransact( true );
  let skip_put: string | null = null;

  ctx.on('put', (at: any) => {
    this.to.next(at);
    if (skip_put && skip_put == at[ACK_]) {
      if (DEBUG) {
        const now = Date.now();
        if (now - _debug_tick > 1000) {
          console.log('N in M', _debug_counter - __debug_counter, now - _debug_tick, (_debug_counter - __debug_counter) / (now - _debug_tick));
          _debug_tick = now;
          __debug_counter = _debug_counter;
        }
        _debug_counter++;
        console.log(new Date(), 'skipping put in-get:', _debug_counter, ' get putting:', skip_put, at[ACK_], JSON.stringify(at.put));
      }

      return;
    }
    DEBUG && console.log(new Date(), 'PUT', at[SEQ_], at[ACK_], JSON.stringify(at.put));
    Gun.graph.is(at.put, null, (value: any, field: string, node: any, soul: string) => {
      let id: any;
      // kinda hate to always do a select just to see that the new update is newer than what was there.
      // console.log( "do select soul field", field, `select state from Record where soul='${client.escape(soul)}' and field='${client.escape(field)}'` );
      const record = client.do(`select state from record where soul='${client.escape(soul)}' and field='${client.escape(field)}'`);
      {
        let dataRelation: any, dataValue: any, tmp: any;
        const state = Gun.state.is(node, field) as number;
        // Check to see if what we have on disk is more recent.
        // console.log( "result?", record )
        if (record && record.length && state <= record[0].state) {
          DEBUG && console.log(new Date(), 'already newer in database..');
          ctx.on('in', { [ACK]: at[rel_], ok: 1 });

          return;
        }
        if (value && (tmp = value[rel_])) { // TODO: Don't hardcode.
          dataRelation = `'${client.escape(JSON.stringify(tmp))}'` as string;
          dataValue = 'NULL';
        } else if (value) {
          dataRelation = 'NULL';
          dataValue = `'${client.escape(JSON.stringify(value))}'` as string;
        }
        else {
          dataRelation = 'NULL';
          dataValue = 'NULL';
        }
        try {
          DEBUG && console.log(new Date(), 'Do replace field soul:', soul, ' field:', field, 'val:', dataValue);
          client.do(`replace into record (soul,field,value,relation,state) values('${client.escape(soul)}','${client.escape(field)}',${dataValue},${dataRelation},${state})`);
          ctx.on('in', { [ACK]: at[rel_], ok: 1 });
        } catch (e) {
          ctx.on('in', { [ACK]: at[rel_], err: e });

