import { Component, OnInit } from '@angular/core';
import { Transaction, UserInventory } from '@app/core';
import { TransactionService } from '@app/transaction/service';
import { TableComponent } from '../table';
import { ItemCardComponent } from '@app/inventory';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [TableComponent, ItemCardComponent, NgIf],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
  transactions!: Transaction[];

  inventoryView!: UserInventory | null;

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchTransactionData();
  }

  fetchTransactionData = () =>
    this.transactionService.getTransactions().subscribe({
      next: (response: Transaction[]) => {
        this.transactions = response;
        this.transactionService.setTransactionData(response);
      },
    });

  onInventoryView = (data: UserInventory) => {
    this.inventoryView = data;
  };

  onCloseInventoryView = () => {
    this.inventoryView = null;
  };
}
