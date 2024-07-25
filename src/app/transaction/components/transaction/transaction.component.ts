import { Component, OnInit } from '@angular/core';
import { Transaction } from '@app/core';
import { TransactionService } from '@app/transaction/service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
})
export class TransactionComponent implements OnInit {
  transactions!: Transaction[];

  constructor(private transactionService: TransactionService) {}

  ngOnInit(): void {
    this.fetchTransactionData();
  }

  fetchTransactionData = () =>
    this.transactionService.getTransactions().subscribe({
      next: (response: Transaction[]) => {
        this.transactions = response;
      },
    });
}
