import * as duckdb from '../../src';
import * as arrow from 'apache-arrow';

// https://github.com/duckdb/duckdb-wasm/issues/393
export function testGitHubIssue393(db: () => duckdb.AsyncDuckDB): void {
    let conn: duckdb.AsyncDuckDBConnection | null = null;
    beforeEach(async () => {
        await db().flushFiles();
    });
    afterEach(async () => {
        if (conn) {
            await conn.close();
            conn = null;
        }
        await db().flushFiles();
        await db().dropFiles();
    });
    describe('GitHub issues', () => {
        it('393', async () => {
            await db().open({
                path: ':memory:',
                query: {
                    castTimestampToDate64: true,
                },
            });
            conn = await db().connect();
            const date = await conn.query<{
                ts: arrow.DateMillisecond;
            }>(`SELECT TIMESTAMP '1992-03-22 01:02:03' as ts`);
            expect(date.toArray()[0].ts).toEqual(new Date(Date.UTC(1992, 2, 22, 1, 2, 3)));
        });
    });
}
