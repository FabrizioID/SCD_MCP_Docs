import type { FastMCP } from 'fastmcp';
import { UserError } from 'fastmcp';
import { z } from 'zod';
import { getDocsClient } from '../../clients.js';
import {
  DocumentIdParameter,
  TableCellRangeParameters,
  validateHexColor,
} from '../../types.js';
import * as GDocsHelpers from '../../googleDocsApiHelpers.js';

export function register(server: FastMCP) {
  server.addTool({
    name: 'setTableCellBackgroundColor',
    description:
      'Sets the background color of one cell or a rectangular range of cells within a Google Docs table.',
    parameters: DocumentIdParameter.extend({
      ...TableCellRangeParameters.shape,
      backgroundColor: z
        .string()
        .refine(validateHexColor, {
          message: 'Invalid hex color format (e.g., #FFCC00 or #FC0)',
        })
        .describe('Hex color to apply to the target table cells.'),
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
        `Setting table cell background in doc ${args.documentId}: table=${args.tableStartIndex}, row=${args.rowIndex}, col=${args.columnIndex}, rowSpan=${args.rowSpan}, columnSpan=${args.columnSpan}, color=${args.backgroundColor}${args.tabId ? ` (tab: ${args.tabId})` : ''}`
      );

      try {
        await GDocsHelpers.updateTableCellBackgroundColor(
          docs,
          args.documentId,
          args.tableStartIndex,
          args.rowIndex,
          args.columnIndex,
          args.rowSpan,
          args.columnSpan,
          args.backgroundColor,
          args.tabId
        );

        return `Successfully set background color ${args.backgroundColor} on table ${args.tableStartIndex} starting at (${args.rowIndex}, ${args.columnIndex}) with span ${args.rowSpan}x${args.columnSpan}${args.tabId ? ` in tab ${args.tabId}` : ''}.`;
      } catch (error: any) {
        log.error(
          `Error setting table cell background in doc ${args.documentId}: ${error.message || error}`
        );
        if (error instanceof UserError) throw error;
        throw new UserError(
          `Failed to set table cell background color: ${error.message || 'Unknown error'}`
        );
      }
    },
  });
}
