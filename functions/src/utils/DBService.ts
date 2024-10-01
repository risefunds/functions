import { IReferenceDB, IWhereParam } from '@risefunds/sdk';
import { firestore, storage } from 'firebase-admin';
import admin from 'firebase-admin';

export class DBService implements IReferenceDB {
  isAdmin = true;
  db = admin.firestore();
  storage = storage();

  private getCollection<Model>(
    collectionName: string
  ): FirebaseFirestore.CollectionReference<Model> {
    return this.db.collection(
      collectionName
    ) as FirebaseFirestore.CollectionReference<Model>;
  }

  initBatch(): unknown {
    return this.db.batch();
  }

  async commitBatch(batch: firestore.WriteBatch): Promise<void> {
    await batch.commit();
  }

  transformDateTo(date: Date): admin.firestore.Timestamp {
    return admin.firestore.Timestamp.fromDate(date);
  }

  transformDateFrom(object: admin.firestore.Timestamp): Date {
    return object.toDate();
  }

  async get<Model>(collectionName: string, id: string): Promise<Model> {
    const document = this.getCollection<Model>(collectionName).doc(id);
    const res = await document.get();

    const dataResponse = res.data();

    if (res.exists && dataResponse) {
      return dataResponse;
    }

    throw new Error(`Model - ${collectionName} item not found`);
  }

  persistBatch<Model>(
    collectionName: string,
    data: Model,
    batch: firestore.WriteBatch
  ): void {
    if (!(data as unknown as { id: string }).id)
      throw new Error('ID is not defined');

    const document = this.getCollection<Model>(collectionName).doc(
      (data as unknown as { id: string }).id
    );
    batch.set(document, {
      ...data,
    });
  }

  async persist<Model>(collectionName: string, data: Model): Promise<Model> {
    if (!(data as unknown as { id: string }).id)
      throw new Error('ID is not defined');

    const document = this.getCollection<Model>(collectionName).doc(
      (data as unknown as { id: string }).id
    );
    await document.set({
      ...data,
    });
    const res = await document.get();
    const dataResponse = res.data();
    if (dataResponse) {
      return dataResponse;
    }

    throw new Error(`Model - ${collectionName} item not found`);
  }

  private getQueryWithParamsArray<Model>(
    collectionName: string,
    queryParams: IWhereParam[] = []
  ): firestore.Query<Model> {
    let query: FirebaseFirestore.Query<Model> =
      this.getCollection<Model>(collectionName);

    for (const param of queryParams.filter((qp) => {
      return qp.key === 'orderBy';
    })) {
      query = query.orderBy(param.value as never, param.operator as never);
    }

    for (const param of queryParams.filter((qp) => {
      return qp.key === 'limit';
    })) {
      query = query.limit(param.value as number);
    }

    for (const param of queryParams.filter((qp) => {
      return qp.key !== 'orderBy' && qp.key !== 'limit';
    })) {
      query = query.where(param.key, param.operator as never, param.value);
    }
    return query;
  }

  async where<Model>(
    collectionName: string,
    queryParams: IWhereParam[]
  ): Promise<Model[]> {
    const query = this.getQueryWithParamsArray<Model>(
      collectionName,
      queryParams
    );
    const qs = await query.get();
    return qs.docs.map((doc) => {
      return doc.data();
    });
  }
}
