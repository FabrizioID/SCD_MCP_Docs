import type { FastMCP } from 'fastmcp';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { getDocsClient } from '../../clients.js';
import { DocumentIdParameter, TableCellRangeParameters } from '../../types.js';
import * as GDocsHelpers from '../../googleDocsApiHelpers.js';

export function register(server: FastMCP) {
  server.addTool({
    name: 'mergeTableCells',
    description:
      'Merges a rectangular range of cells within a Google Docs table. Use the table startIndex plus 0-based row/column coordinates to target the cells.',
    parameters: DocumentIdParameter.extend({
      ...TableCellRangeParameters.shape,
      tabId: z
        .string()
        .optional()
        .describe(
          'The ID of the specific tab containing the table. Use listDocumentTabs to get tab IDs. If omitted, the first tab is used.'
        ),
    }),
    execute: async (args, { log }) => {
      const docs = await getDocsClient();

      log.info(
        `Merging table cells in doc ${args.documentId}: table=${args.tableStartIndex}, row=${args.rowIndex}, col=${args.columnIndex}, rowSpan=${args.rowSpan}, columnSpan=${args.columnSpan}${args.tabId ? ` (tab: ${args.tabId})` : ''}`
      );

      try {
        await GDocsHelpers.mergeTableCells(
          docs,
          args.documentId,
          args.tableStartIndex,
          args.rowIndex,
          args.columnIndex,
          args.rowSpan,
          args.columnSpan,
          args.tabId
        );

        return `Successfully merged cells in table ${args.tableStartIndex} starting at (${args.rowIndex}, ${args.columnIndex}) with span ${args.rowSpan}x${args.columnSpan}${args.tabId ? ` in tab ${args.tabId}` : ''}.`;
      } catch (error: any) {
        log.error(`Error merging table cells in doc ${args.documentId}: ${error.message || error}`);
        if (error instanceof UserError) throw error;
        throw new UserError(`Failed to merge table cells: ${error.message || 'Unknown error'}`);
      }
    },
  });
}
