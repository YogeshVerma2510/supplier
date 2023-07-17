public with sharing class supplierpartdatatable {
  //Data Table    
    @AuraEnabled(cacheable = true)
    public static List<SObjectResult> getPartdata(String recordId){
       
        List<Supplier_Part__c> spList = new List<Supplier_Part__c>();
        if (Schema.sObjectType.Supplier_Part__c.fields.Name.isAccessible() &&
           Schema.sObjectType.Supplier_Part__c.fields.Lead_Time__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.fields.Part_Name__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.fields.Part_Type__c.isAccessible() &&
          Schema.sObjectType.Parts__c.fields.Part_Number__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.fields.Part__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.fields.Supplier__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.fields.Revision__c.isAccessible() &&
          Schema.sObjectType.Revision__c.fields.Revision_ID__c.isAccessible() &&
          Schema.sObjectType.Revision__c.isAccessible() &&
          Schema.sObjectType.Supplier_Part__c.isAccessible() &&
          Schema.sObjectType.Parts__c.isAccessible()){
          spList = [ SELECT Id,Name,Lead_Time__c,Bom__c,Bom__r.BOM_Number__c,Bom_Name__c,Part__r.Part_Number__c,Part_Name__c,Part__c,
          Part_Type__c,Revision__r.Revision_ID__c,Revision__r.Id FROM Supplier_Part__c where Supplier__c =:recordId];
          }
        List<String>bomIds = new List<String>();
          for(Supplier_Part__c bom:spList){
              bomIds.add(bom.Part__c);
              bomIds.add(bom.Bom__c);
          }
        system.debug('Here: ' + bomIds);
 
          List< ContentDocumentLink > contentDocumentLinks1 = new List<ContentDocumentLink>();
          if (Schema.sObjectType.ContentDocumentLink.fields.ContentDocumentId.isAccessible() &&
          Schema.sObjectType.ContentDocumentLink.fields.LinkedEntityId.isAccessible() &&
          Schema.sObjectType.ContentDocumentLink.isAccessible()){
             contentDocumentLinks1 = [SELECT ContentDocumentId,LinkedEntityId FROM
             ContentDocumentLink WHERE LinkedEntityId in:bomIds];
          }
            List<String> cdls = new List<String>();
            Map<String,String> cdmap= new Map<String,String>();
          	for(ContentDocumentLink c:contentDocumentLinks1){
              cdls.add(c.ContentDocumentId);
              cdmap.put(c.LinkedEntityId,c.ContentDocumentId);
          }
         
          for(Supplier_Part__c b:spList){
               if(!cdmap.containsKey(b.Part__c)){
                  cdmap.put(b.Part__c,'');
                }   
          }
          Map<String,String> cvmap= new Map<String,String>();
          List<ContentVersion> cvs=  new List<ContentVersion>();
          if(Schema.sObjectType.ContentVersion.fields.ContentDocumentId.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.Title.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.VersionData.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.isLatest.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.Thumb_Nail__c.isAccessible() &&
          Schema.sObjectType.ContentVersion.isAccessible()){
          cvs = [SELECT Id,ContentDocumentId,Title,VersionData,isLatest FROM ContentVersion WHERE ContentDocumentId in:cdls and Thumb_Nail__c=true];
          }
          for(ContentVersion c:cvs){
               if(!cvmap.containsKey(c.ContentDocumentId)){
                  cvmap.put(c.ContentDocumentId,c.Id);
                }
          }
          List<String> cvIds = new List<String>();
          list<string>mapValue= cdmap.values();
          Set<String>mapKeyset = cdmap.keySet();
          List<String>mapKey = new List<String>();
          for(String s:mapKeyset){
              mapKey.add(s);
          }
          Map<String,String> finalMAp = new Map<String,String>();
          for(Integer i=0;i<mapKey.Size();i++){
                if(cvmap.containsKey(mapValue[i])){
                  finalMap.put(mapKey[i],cvmap.get(mapValue[i]));
                }
              else{
                  finalMap.put(mapKey[i],'');
              }
          }
        List<SObjectResult> newList = new List<SObjectResult>();
      for(Supplier_Part__c sp:spList){
              if(sp.Part__c != Null ) {
                 Id id = sp.Id;
                 String thumb='';
                      if(finalMap.containsKey(sp.Part__c)){ 
                           thumb=finalMap.get(sp.Part__c);
                      }
                          else{
                             thumb='';
                          }
                    String part = sp.Part__c;
                    String leadtime;
                    String partnumber = sp.Part__r.Part_Number__c;
                    String name = sp.Part_Name__c;
                    String rev = sp.Revision__r.Revision_ID__c;
                    String revisionBom = sp.Revision__r.Id;
                    String type = sp.Part_Type__c;
                   if(sp.Lead_Time__c != null){
                      leadtime = sp.Lead_Time__c + ' days';
                    }
                        else{
                         leadtime = '';
                        }
                   newList.add(new SObjectResult(id,partnumber,name,rev,revisionBom,leadtime,type,part,thumb));//bomname
              }
              else if(sp.Bom__c != Null) {
                  Id id = sp.Id;
             String thumb='';
                   if(finalMap.containsKey(sp.Bom__c)){
                          thumb=finalMap.get(sp.Bom__c);
                    }
                        else{
                           thumb='';
                        }
            String part = sp.Bom__c; 
            String leadtime;
            String partnumber = sp.Bom__r.BOM_Number__c; 
            String name = sp.Bom_Name__c;
            String rev = sp.Revision__r.Revision_ID__c;
            String revisionBom = sp.Revision__r.Id;
             String type = sp.Part_Type__c;
            if(sp.Lead_Time__c != null){
              leadtime = sp.Lead_Time__c + ' days';
            }
            else{
                leadtime = '';
            }
            newList.add(new SObjectResult(id,partnumber,name,rev,revisionBom,leadtime,type,part,thumb));
             }
      } 
        system.debug('Data: ' + newList);
        return newList;
    }    
 
    public class SObjectResult
    {
        @AuraEnabled
        public String thumb;
        @AuraEnabled
        public Id recId;
        @AuraEnabled
        public String recPart;
        @AuraEnabled
        public String recNumber;
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public String recRev;
        @AuraEnabled
        public String revBom;
        @AuraEnabled
        public String recTime;
        @AuraEnabled
        public String recType;
        /*@AuraEnabled
        public String nameBomN;*/
       
        public SObJectResult(Id recscaIdTemp,String recNumberTemp,String recscCriteriaTemp,String recRevi,String revBoms,String recscRatingTemp, String recscCommentsTemp, String recscPartTemp, String fileid) {
          //String revBomTemp  
          recId=recscaIdTemp;
            recNumber=recNumberTemp;
            recName=recscCriteriaTemp;
            recRev=recRevi;
            revBom=revBoms;
            recTime =recscRatingTemp;
            recType=recscCommentsTemp;
            recPart=recscPartTemp;
            thumb=fileid;
            //nameBomN=revBomTemp;
           
        }
    }
 
  //search table
  @AuraEnabled(cacheable=true)
  public static List<SObjectSearchResult> searchPart(String isName,String recordId)
  {
  List<SObjectSearchResult> newList1=new List<SObjectSearchResult>();
  if(isName != '')
  {
  String findname = '%'+isName+'%';
 
  List<Supplier_Part__c> spList1 = new List<Supplier_Part__c>();
  if (Schema.sObjectType.Supplier_Part__c.fields.Name.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Lead_Time__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Part_Name__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Part_Type__c.isAccessible() &&
  Schema.sObjectType.Parts__c.fields.Part_Number__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Part__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Revision__c.isAccessible() &&
  Schema.sObjectType.Revision__c.fields.Revision_ID__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.fields.Supplier__c.isAccessible() &&
  Schema.sObjectType.Revision__c.isAccessible() &&
  Schema.sObjectType.Supplier_Part__c.isAccessible() &&
  Schema.sObjectType.Parts__c.isAccessible()){
   
      spList1 = [SELECT Id,Name,Lead_Time__c,Part_Name__c,Part_Type__c,Part__r.Part_Number__c, Bom__c, Bom_Name__c,Bom__r.BOM_Number__c,Revision__r.Revision_ID__c	,Revision__r.Id	 from Supplier_Part__c
      where (Part_Name__c like:findname OR Bom_Name__c Like:findname OR Part__r.Part_Number__c Like:findname OR Bom__r.BOM_Number__c  Like:findname) AND Supplier__c =:recordId order by Part__r.Part_Number__c desc];
      }
  List<String>bomIds = new List<String>();
          for(Supplier_Part__c bom:spList1){
              bomIds.add(bom.Part__c);
              bomIds.add(bom.Bom__c);
          }
          List< ContentDocumentLink > contentDocumentLinks1 = new List<ContentDocumentLink>();
          if(Schema.sObjectType.ContentDocumentLink.fields.ContentDocumentId.isAccessible() &&
          Schema.sObjectType.ContentDocumentLink.fields.LinkedEntityId.isAccessible() &&
          Schema.sObjectType.ContentDocumentLink.isAccessible()){
          contentDocumentLinks1 = [SELECT ContentDocumentId,LinkedEntityId FROM
          ContentDocumentLink WHERE LinkedEntityId in:bomIds];
          }
          List<String> cdls = new List<String>();
           Map<String,String> cdmap= new Map<String,String>();
          for(ContentDocumentLink c:contentDocumentLinks1){
              cdls.add(c.ContentDocumentId);
              cdmap.put(c.LinkedEntityId,c.ContentDocumentId);
          }
         
          for(Supplier_Part__c b:spList1){
              if(!cdmap.containsKey(b.Part__c)){
                  cdmap.put(b.Part__c,'');
              }
             
          }
          Map<String,String> cvmap= new Map<String,String>();
          List<ContentVersion> cvs= new List<ContentVersion>();
          if(Schema.sObjectType.ContentVersion.fields.ContentDocumentId.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.Title.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.VersionData.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.isLatest.isAccessible() &&
          Schema.sObjectType.ContentVersion.fields.Thumb_Nail__c.isAccessible() &&
          Schema.sObjectType.ContentVersion.isAccessible()){
          cvs =  [SELECT Id,ContentDocumentId,Title,VersionData,isLatest FROM ContentVersion WHERE ContentDocumentId in:cdls and Thumb_Nail__c=true];
          }
          for(ContentVersion c:cvs){
              if(!cvmap.containsKey(c.ContentDocumentId)){
                  cvmap.put(c.ContentDocumentId,c.Id);
              }
          }
          List<String> cvIds = new List<String>();
          list<string>mapValue= cdmap.values();
          Set<String>mapKeyset = cdmap.keySet();
          List<String>mapKey = new List<String>();
          for(String s:mapKeyset){
              mapKey.add(s);
          }
          Map<String,String> finalMAp = new Map<String,String>();
          for(Integer i=0;i<mapKey.Size();i++){
              if(cvmap.containsKey(mapValue[i])){
                  finalMap.put(mapKey[i],cvmap.get(mapValue[i]));
              }else{
                  finalMap.put(mapKey[i],'');
              }
          }
for(Supplier_Part__c sp:spList1){
  if(sp.Part__c != Null ) {
    Id id = sp.Id;
    String thumb='';
              if(finalMap.containsKey(sp.Part__c)){
                  thumb=finalMap.get(sp.Part__c);
              }else{
                  thumb='';
              }
              String part = sp.Part__c;
            /*if(sp.Part__c != Null) {
                part = sp.Part__c;
            }
            if(sp.Bom_Name__c != Null) {
                part = sp.Bom_Name__c;
            }*/
           
          String leadtime;
            String partnumber = sp.Part__r.Part_Number__c;
            /*if(sp.Part__r.Number__c != Null)
            {
            //String bomname=sp.Bom__r.BOM_Number__c;
            partnumber = sp.Part__r.Number__c;
            }
            if(sp.Bom__r.BOM_Number__c != Null) {
                partnumber = sp.Bom__r.BOM_Number__c;
            }*/
            String name = sp.Part_Name__c;
            String rev = sp.Revision__r.Revision_ID__c;
            String revisionBom = sp.Revision__r.Id;
            /*if(sp.Part_Name__c !=Null)
            {
              name =  sp.Part_Name__c;
            }
            if(sp.Bom_Name__c !=Null)
            {
              name =  sp.Bom_Name__c;
            }*/
            String type = sp.Part_Type__c;
            if(sp.Lead_Time__c != null){
              leadtime = sp.Lead_Time__c + ' days';
            }
    else{
        leadtime = '';
    }
    newList1.add(new SObjectSearchResult(id,partnumber,name,rev,revisionBom,leadtime,type,part,thumb));
  //   id,partnumber,name,leadtime,type,,thumb
  }

      else if(sp.Bom__c != Null) {
                  Id id = sp.Id;
            String thumb='';
              if(finalMap.containsKey(sp.Bom__c)){
                  thumb=finalMap.get(sp.Bom__c);
              }else{
                  thumb='';
              }
            String part = sp.Bom__c;
            /*if(sp.Part__c != Null) {
                part = sp.Part__c;
            }
            if(sp.Bom_Name__c != Null) {
                part = sp.Bom_Name__c;
            }*/
           
            String leadtime;
            String partnumber = sp.Bom__r.BOM_Number__c;
            /*if(sp.Part__r.Number__c != Null)
            {
            //String bomname=sp.Bom__r.BOM_Number__c;
            partnumber = sp.Bom__r.Number__c;
            }
            if(sp.Bom__r.BOM_Number__c != Null) {
                partnumber = sp.Bom__r.BOM_Number__c;
            }*/
            String name = sp.Bom_Name__c;
            /*if(sp.Part_Name__c !=Null)
            {
              name =  sp.Part_Name__c;
            }
            if(sp.Bom_Name__c !=Null)
            {
              name =  sp.Bom_Name__c;
            }*/
            String rev = sp.Revision__r.Revision_ID__c;
            String revisionBom = sp.Revision__r.Id;
            String type = sp.Part_Type__c;
            if(sp.Lead_Time__c != null){
              leadtime = sp.Lead_Time__c + ' days';
            }
            else{
                leadtime = '';
            }
          
        newList1.add(new SObjectSearchResult(id,partnumber,name,rev,revisionBom,leadtime,type,part,thumb));//bomname
              }
        }
        /*for(Supplier_Part__c sp:spList){
          Id id = sp.Id;
          String thumb='';
            if(finalMap.containsKey(sp.Part__c)){
                thumb=finalMap.get(sp.Part__c);
            }else{
                thumb='';
            }
          String part = sp.Part__c;
          String leadtime;
          //String bomname=sp.Bom__r.BOM_Number__c;
          String partnumber = sp.Bom__r.BOM_Number__c;
          String name = sp.Bom_Name__c;
          String type = sp.Part_Type__c;
          if(sp.Lead_Time__c != null){
            leadtime = sp.Lead_Time__c + ' days';
          }
          else{
              leadtime = '';
          }
          newList.add(new SObjectSearchResult(id,partnumber,name,leadtime,type,part,thumb));//bomname
      }*/
  
        
   }
    system.debug('Data: ' + newList1);
        return newList1;
  }
  public class SObjectSearchResult
    {
       
        @AuraEnabled
        public Id recId;
        @AuraEnabled
        public String recNumber;
        @AuraEnabled
        public String recName;
        @AuraEnabled
        public String recRev;
        @AuraEnabled
        public String revBom;
        @AuraEnabled
        public String recTime;
        @AuraEnabled
        public String recType;
        @AuraEnabled
        public String thumb;
        @AuraEnabled
        public String recPart;
       
        public SObjectSearchResult(Id recscaIdTemp,String recNumberTemp,String recscCriteriaTemp,String recRevi,String revBoms,String recscRatingTemp, String recscCommentsTemp,String recscPartTemp,String fileid) {
            recId=recscaIdTemp;
            recNumber=recNumberTemp;
            recName=recscCriteriaTemp;
            recRev=recRevi;
            revBom=revBoms;
            recTime = recscRatingTemp;
            recType=recscCommentsTemp;
            recPart=recscPartTemp;
            thumb=fileid;
           // nameBomN=revBomTemp;
        }
      } 
  // DELETE
 
  @AuraEnabled
  public static void deletePart(List<Id> ids) {
    try {
      List<Supplier_Part__c> c = new List<Supplier_Part__c>();
      for (Id cid : ids) {
        c.add(new Supplier_Part__c(Id = cid));
      }
      if (Schema.sObjectType.Supplier_Part__c.isDeletable()){
      if (!c.isEmpty()) {
        delete c;
      }
  }
 
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
 
 
  @AuraEnabled(cacheable=true)
  public static String currentUserInfo() {
      Profile u = new Profile();
      if (Schema.sObjectType.Profile.fields.Name.isAccessible()&&
      Schema.sObjectType.User.fields.ProfileId.isAccessible()&&
      Schema.sObjectType.Profile.isAccessible()&&
      Schema.sObjectType.User.isAccessible()){
       u = [SELECT Id, Name FROM Profile WHERE Id IN (SELECT ProfileId FROM User WHERE Id = :UserInfo.getUserId())];
      }
      return u.Name;
    }
    
    /*
    public  class SObjectIssue {
      @AuraEnabled
      public Id recId;
      @AuraEnabled
      public String recNum;
      @AuraEnabled
      public String recName;
      @AuraEnabled
      public String recRev;
      @AuraEnabled
        public String revBom;
      @AuraEnabled
      public String recType;
      @AuraEnabled
      public String recSeverity;
      @AuraEnabled
      public String recOccurDate;
      @AuraEnabled
      public String recResolDate;
      @AuraEnabled
      public String recAnalyze;
    }

     /*  
     public SObjectIssue(Id recIdTemp,string recNumTemp,string recNameTemp,String recRevis,String revBomss,string recTypeTemp,string recSevTemp,string recOcTemp,string recResTemp,string recAnTemp){
          recId=recIdTemp;
          recNum=recNumTemp;
          recName=recNameTemp;
          recRev=recRevis;
          revBom=revBomss;
          recType=recTypeTemp;
          recSeverity= recSevTemp;
          recOccurDate=recOcTemp;
          recResolDate=recResTemp;
          recAnalyze=recAnTemp;
          
      }
     
  }
  */


   
//   @AuraEnabled(cacheable=true)
//   public static List<SObJectResult2> getResults(String value, List<String> selectedRecId) {
//   List<SObJectResult2> sObjectResultList2 = new List<SObJectResult2>();
//   system.debug('----------------++----------'+value+'====='+selectedRecId);
//   if(selectedRecId == null)
//      selectedRecId = new List<String>();
//   if(Schema.SObjectType.Milestone__c.isAccessible() &&
//       Schema.SObjectType.Milestone__c.fields.Name.isAccessible() &&
//       Schema.SObjectType.Task__c.isAccessible() &&
//       Schema.SObjectType.Task__c.fields.Name.isAccessible() &&
//       Schema.SObjectType.Part__c.isAccessible() &&
//       Schema.SObjectType.Part__c.fields.Number__c.isAccessible() &&
//       Schema.SObjectType.Part__c.fields.Name.isAccessible() &&
//       Schema.SObjectType.BOM__c.isAccessible() &&
//       Schema.SObjectType.BOM__c.fields.Name.isAccessible()&&
//       Schema.SObjectType.BOM__c.fields.BOM_Number__c.isAccessible()

//     ){


//      if(String.isNotEmpty(value)) {
//         String query = 'Select Id,Part_Name__c,Number__c FROM Part__c  WHERE (Name LIKE \'%' + value.trim() + '%\' or Number__c  LIKE \'%' + value.trim() + '%\') and ID NOT IN: selectedRecId';
//         system.debug(query);
//         for(Part__c so : Database.Query(query)) {
//            string reName = so.Name;
//            Id pId=so.Id;
//            string pNum=so.Number__c;
//            sObjectResultList2.add(new SObjectResult2(reName,pId,pNum));
//         }
//     }

//   }
//   if(String.isNotEmpty(value)) {
//     String query = 'Select Id,Name,BOM_Number__c FROM BOM__c WHERE (Name LIKE \'%' + value.trim() + '%\' or BOM_Number__c LIKE \'%' + value.trim() + '%\') and ID NOT IN: selectedRecId';
//     system.debug(query);
//     for(BOM__c so : Database.Query(query)) {
//         String bName = so.Name;
//         Id bId = so.Id;
//         String bNum= so.BOM_Number__c;
//         sObjectResultList2.add(new SObjectResult2(bName,bId,bNum));
//     }
//   }

//   return sObjectResultList2;
//   }

//   public class SObjectResult2 {
//      @AuraEnabled
//      public String recName;
//      @AuraEnabled
//      public Id recId;
//      @AuraEnabled
//      public String recNumber;
   
//      public SObJectResult2(String recNameTemp, Id recIdTemp,string recNumberTemp) {
//          recName = recNameTemp;
//          recId = recIdTemp;
//          recNumber = recNumberTemp;
//      }
//   }
//   @AuraEnabled
//  public static List<Supplier_Part__c> insertAffectedItems(List<string> multipleId,string fId){
 
//    List<Supplier_Part__c> lookupIds =new List<Supplier_Part__c>();
//    // getting Id from list of Each Object record
//    List<Id> partIds= new List<Id>();
//    List<Id> bomIds= new List<Id>();
 
 

//    List<BOM__c> bom = new List<BOM__c>();

//    List<Part__c> prt = new List<Part__c>();

//    string QueryP;
//    string QueryB;


//    Supplier_Part__c fLookup = new Supplier_Part__c();
//    if( Schema.SObjectType.Part__c.isAccessible())
//    {
//        QueryP ='Select Id from Part__c Where Id IN : multipleId';
//    }
//    prt = Database.query(QueryP);
//    if(Schema.SObjectType.BOM__c.isAccessible())
//    {
//    QueryB = 'Select Id From BOM__c Where Id IN : multipleId';
//    }
//    bom = Database.query(QueryB);
 
//    /**
//    * adding Id's of Part, BOM, Task and Miestone into junction object based on finding record Id
//    */
//    for(Part__c p: prt){
//        partIds.add(p.Id);
//    }
//    for(BOM__c b: bom){
//        bomIds.add(b.Id);
//    }

//    if(partIds.size()!=0){
//        for(Id partId:partIds){
//            Supplier_Part__c fLookupP = new Supplier_Part__c();
//                fLookupP.Part__c =partId;
//                //fLookupP.Finding__c=fId;
//                lookupIds.add(fLookupP);
//        }    
//    }
//   //  if( bomIds.size()!=0 ){
//   //      for(Id bomId:bomIds){
//   //         Supplier_Part__c fLookupB = new Supplier_Part__c();
//   //              fLookupB.BOM_Configuration__c=bomId;
//   //              //fLookupB.Finding__c=fId;
//   //              lookupIds.add(fLookupB);        
//   //      }
//   //  }
 

 
//            insert lookupIds;
 
//    return lookupIds;
//   }


}